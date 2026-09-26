package com.yno.foodcyclebackend.foodProvider.service;

import com.yno.foodcyclebackend.dao.FoodListingDao;
import com.yno.foodcyclebackend.entity.FoodListing;
import com.yno.foodcyclebackend.entity.FoodProvider;
import com.yno.foodcyclebackend.enums.ListingStatus;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.foodProvider.dao.FoodProviderDao;
import com.yno.foodcyclebackend.foodProvider.dto.request.CreateFoodListingRequest;
import com.yno.foodcyclebackend.foodProvider.dto.request.UpdateFoodListRequest;
import com.yno.foodcyclebackend.foodProvider.dto.response.FoodListingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class FoodProviderService {
    private final FoodProviderDao foodProviderDao;
    private final FoodListingDao foodListingDao;

    @Transactional
    public FoodListingResponse createListing(CreateFoodListingRequest request,
                                             Authentication authentication) {
        FoodProvider provider = getVerifiedProvider(authentication);
        validateSchedule(request.getExpiryTime(), request.getPickupDeadline());

        FoodListing listing =new FoodListing();
        listing.setProvider(provider);
        copyFields(request,listing);
        listing.setStatus(ListingStatus.AVAILABLE);
        listing.setUrgencyScore(calculateUrgencyScore(listing));
        return FoodListingResponse.from(foodListingDao.save(listing));
    }

    @Transactional(readOnly = true)
    public List<FoodListingResponse> getMyListings(Authentication authentication) {
        FoodProvider provider = getVerifiedProvider(authentication);
        return foodListingDao.findByProviderId(provider.getId())
                .stream()
                .map(FoodListingResponse::from)
                .toList();
    }

    @Transactional
    public FoodListingResponse updateListing(Long listingId,
                                             UpdateFoodListRequest request,
                                            Authentication authentication) {
        FoodProvider provider = getVerifiedProvider(authentication);
        FoodListing listing = getOwnedListing(listingId, provider);
         validateSchedule(request.getExpiryTime(), request.getPickupDeadline());
        copyFields(request, listing);
        listing.setUrgencyScore(calculateUrgencyScore(listing));
        return FoodListingResponse.from(foodListingDao.save(listing));
    }

    @Transactional
    public void deleteListing(Long listingId, Authentication authentication) {
        FoodProvider provider = getVerifiedProvider(authentication);
        FoodListing listing = getOwnedListing(listingId, provider);
        foodListingDao.delete(listing);
    }

    private FoodProvider getVerifiedProvider(Authentication authentication) {
        String email = authentication.getName();
        System.out.println("DEBUG: Getting provider for email: " + email);
        FoodProvider provider = foodProviderDao.findByUserEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Food Provider profile not found!"));

        System.out.println("DEBUG: Provider found, verification status: " + provider.getUser().getVerificationStatus() + ", isActive: " + provider.getUser().getIsActive());

        if (provider.getUser().getVerificationStatus() != VerificationStatus.VERIFIED
            || !Boolean.TRUE.equals(provider.getUser().getIsActive())) {
            throw new AccessDeniedException("Food provider account is not approved");
        }
        return provider;
    }

    public FoodListing getOwnedListing(Long listingId, FoodProvider provider) {
        FoodListing listing = foodListingDao.findById(listingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Food Provider listing not found!"));
        if (!listing.getProvider().getId().equals(provider.getId())) {
            throw new AccessDeniedException("You do not own this food Listing");
        }
        return listing;
    }

    public void copyFields(CreateFoodListingRequest request, FoodListing listing) {
        listing.setTitle(request.getTitle().trim());
        listing.setDescription(request.getDescription());
        listing.setQuantityKg(request.getQuantityKg());
        listing.setServingsEquivalent(request.getServingsEquivalent());
        if (request.getPickupDeadline() != null) {
            listing.setPreparedTime(request.getPreparedTime());
        }
        listing.setExpiryTime(request.getExpiryTime());
        listing.setPickupDeadline(request.getPickupDeadline());
    }

    public void copyFields(UpdateFoodListRequest request, FoodListing listing) {
        listing.setTitle(request.getTitle().trim());
        listing.setDescription(request.getDescription());
        listing.setQuantityKg(request.getQuantityKg());
        listing.setServingsEquivalent(request.getServingsEquivalent());
        listing.setPreparedTime(request.getPreparedTime());
        listing.setExpiryTime(request.getExpiryTime());
        listing.setPickupDeadline(request.getPickupDeadline());
    }

    public double calculateUrgencyScore(FoodListing listing) {
        long minutesUntilExpiry = java.time.Duration.between(LocalDateTime.now(), listing.getExpiryTime()).toMinutes();
        return Math.max(0, 1_000_000d) / Math.max(1, minutesUntilExpiry);
    }

    private void validateSchedule(LocalDateTime expiryTime, LocalDateTime pickupDeadline) {
        if (!pickupDeadline.isBefore(expiryTime)) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "Pickup deadline must be before expiry time"
            );
        }
    }
}
