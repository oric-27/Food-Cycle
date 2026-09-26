package com.yno.foodcyclebackend.service;

import com.yno.foodcyclebackend.dao.FoodClaimDao;
import com.yno.foodcyclebackend.dao.FoodListingDao;
import com.yno.foodcyclebackend.dao.OrganizationDao;
import com.yno.foodcyclebackend.entity.FoodClaim;
import com.yno.foodcyclebackend.entity.FoodListing;
import com.yno.foodcyclebackend.entity.Organization;
import com.yno.foodcyclebackend.enums.ClaimStatus;
import com.yno.foodcyclebackend.enums.ListingStatus;
import com.yno.foodcyclebackend.enums.OfferType;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.dto.request.CreateFoodClaimRequest;
import com.yno.foodcyclebackend.dto.response.FoodClaimResponse;
import com.yno.foodcyclebackend.foodProvider.service.FoodProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class FoodClaimService {
    private final FoodClaimDao foodClaimDao;
    private final FoodListingDao foodListingDao;
    private final OrganizationDao organizationDao;
    private final FoodProviderService foodProviderService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public FoodClaimResponse createClaim(CreateFoodClaimRequest request, Authentication authentication) {
        Organization organization = getVerifiedOrganization(authentication);
        FoodListing listing = foodListingDao.findByIdForUpdate(request.getListingId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Food listing not found"));
        if (listing.getStatus() != ListingStatus.AVAILABLE) {
            throw new ResponseStatusException(BAD_REQUEST, "Food listing is not available");
        }
        if (!LocalDateTime.now().isBefore(listing.getExpiryTime())
                || !LocalDateTime.now().isBefore(listing.getPickupDeadline())) {
            listing.setStatus(ListingStatus.EXPIRED);
            foodListingDao.save(listing);
            throw new ResponseStatusException(BAD_REQUEST, "Food listing has expired");
        }
        if (request.getClaimedServings() > listing.getServingsEquivalent()) {
            throw new ResponseStatusException(BAD_REQUEST, "Requested servings exceed available servings");
        }

        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        FoodClaim claim = new FoodClaim();
        claim.setFoodListing(listing);
        claim.setOrganization(organization);
        claim.setClaimedServings(request.getClaimedServings());
        claim.setTotalPrice(listing.getOfferType() == OfferType.DISCOUNTED_SALE
                ? listing.getPriceAmount() * request.getClaimedServings() / listing.getServingsEquivalent()
                : 0.0);
        claim.setPickupOtpHash(passwordEncoder.encode(otp));
        claim.setPickupOtpExpiresAt(listing.getPickupDeadline());
        claim.setPickupOtpAttempts(0);
        claim.setStatus(ClaimStatus.REQUESTED);
        listing.setStatus(ListingStatus.RESERVED);
        return FoodClaimResponse.from(foodClaimDao.save(claim), otp);
    }

    @Transactional(readOnly = true)
    public List<FoodClaimResponse> getMyClaims(Authentication authentication) {
        Organization organization = getOrganization(authentication);
        return foodClaimDao.findByOrganizationId(organization.getId())
                .stream()
                .map(FoodClaimResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FoodClaimResponse> getProviderClaims(Authentication authentication) {
        var provider = foodProviderService.getVerifiedProviderForClaims(authentication);
        return foodClaimDao.findByFoodListingProviderIdOrderByCreatedAtDesc(provider.getId())
                .stream()
                .map(FoodClaimResponse::from)
                .toList();
    }

    @Transactional
    public FoodClaimResponse updateStatus(
            Long claimId, ClaimStatus requestedStatus, Authentication authentication) {
        var provider = foodProviderService.getVerifiedProviderForClaims(authentication);
        FoodClaim claim = getClaimForUpdate(claimId);
        if (!claim.getFoodListing().getProvider().getId().equals(provider.getId())) {
            throw new AccessDeniedException("You do not own this food claim");
        }

        boolean accepted = claim.getStatus() == ClaimStatus.REQUESTED
                && requestedStatus == ClaimStatus.CONFIRMED;
        boolean rejected = claim.getStatus() == ClaimStatus.REQUESTED
                && requestedStatus == ClaimStatus.REJECTED;
        boolean preparing = claim.getStatus() == ClaimStatus.CONFIRMED
                && requestedStatus == ClaimStatus.PREPARING;
        boolean ready = claim.getStatus() == ClaimStatus.PREPARING
                && requestedStatus == ClaimStatus.READY_FOR_PICKUP;
        if (!(accepted || rejected || preparing || ready)) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid food claim status transition");
        }

        claim.setStatus(requestedStatus);
        if (rejected) {
            claim.setPickupOtpHash(null);
            claim.setPickupOtpExpiresAt(null);
            claim.getFoodListing().setStatus(ListingStatus.AVAILABLE);
        }
        return FoodClaimResponse.from(foodClaimDao.save(claim));
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public FoodClaimResponse verifyPickup(
            Long claimId, String otp, Authentication authentication) {
        var provider = foodProviderService.getVerifiedProviderForClaims(authentication);
        FoodClaim claim = getClaimForUpdate(claimId);
        if (!claim.getFoodListing().getProvider().getId().equals(provider.getId())) {
            throw new AccessDeniedException("You do not own this food claim");
        }
        if (claim.getStatus() != ClaimStatus.READY_FOR_PICKUP || claim.getPickupOtpHash() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Order is not ready for pickup");
        }
        if (claim.getPickupOtpExpiresAt() == null
                || LocalDateTime.now().isAfter(claim.getPickupOtpExpiresAt())) {
            throw new ResponseStatusException(BAD_REQUEST, "Pickup OTP has expired");
        }
        int attempts = claim.getPickupOtpAttempts() == null ? 0 : claim.getPickupOtpAttempts();
        if (attempts >= 5) {
            throw new ResponseStatusException(BAD_REQUEST, "Pickup OTP attempt limit reached");
        }
        if (!passwordEncoder.matches(otp, claim.getPickupOtpHash())) {
            claim.setPickupOtpAttempts(attempts + 1);
            foodClaimDao.save(claim);
            throw new ResponseStatusException(BAD_REQUEST, "Pickup OTP is invalid");
        }

        claim.setStatus(ClaimStatus.COMPLETED);
        claim.setPickupOtpHash(null);
        claim.setPickupOtpExpiresAt(null);
        claim.getFoodListing().setStatus(ListingStatus.PICKED_UP);
        return FoodClaimResponse.from(foodClaimDao.save(claim));
    }

    @Transactional
    public FoodClaimResponse regeneratePickupOtp(Long claimId, Authentication authentication) {
        var provider = foodProviderService.getVerifiedProviderForClaims(authentication);
        FoodClaim claim = getClaimForUpdate(claimId);
        if (!claim.getFoodListing().getProvider().getId().equals(provider.getId())) {
            throw new AccessDeniedException("You do not own this food claim");
        }
        if (claim.getStatus() != ClaimStatus.READY_FOR_PICKUP
                || !LocalDateTime.now().isBefore(claim.getFoodListing().getPickupDeadline())) {
            throw new ResponseStatusException(BAD_REQUEST, "Pickup OTP cannot be renewed");
        }
        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
        claim.setPickupOtpHash(passwordEncoder.encode(otp));
        claim.setPickupOtpExpiresAt(claim.getFoodListing().getPickupDeadline());
        claim.setPickupOtpAttempts(0);
        return FoodClaimResponse.from(foodClaimDao.save(claim), otp);
    }

    @Transactional
    public void cancelClaim(Long claimId, Authentication authentication) {
        Organization organization = getVerifiedOrganization(authentication);
        FoodClaim claim = getClaimForUpdate(claimId);
        if (!claim.getOrganization().getId().equals(organization.getId())) {
            throw new AccessDeniedException("You do not own this food claim");
        }
        if (claim.getStatus() != ClaimStatus.REQUESTED) {
            throw new ResponseStatusException(BAD_REQUEST, "Only pending requests can be cancelled");
        }
        claim.setStatus(ClaimStatus.CANCELLED);
        claim.setPickupOtpHash(null);
        claim.setPickupOtpExpiresAt(null);
        claim.getFoodListing().setStatus(ListingStatus.AVAILABLE);
    }

    private FoodClaim getClaimForUpdate(Long claimId) {
        return foodClaimDao.findByIdForUpdate(claimId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Food claim not found"));
    }

    private Organization getOrganization(Authentication authentication) {
        return organizationDao.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Organization profile not found"));
    }

    private Organization getVerifiedOrganization(Authentication authentication) {
        Organization organization = getOrganization(authentication);
        if (organization.getUser().getVerificationStatus() != VerificationStatus.VERIFIED
                || !Boolean.TRUE.equals(organization.getUser().getIsActive())) {
            throw new AccessDeniedException("Organization account is not approved");
        }
        return organization;
    }
}
