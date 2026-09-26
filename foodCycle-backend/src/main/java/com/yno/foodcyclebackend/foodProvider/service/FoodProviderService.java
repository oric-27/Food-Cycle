package com.yno.foodcyclebackend.foodProvider.service;

import com.yno.foodcyclebackend.dao.FoodListingDao;
import com.yno.foodcyclebackend.dao.FoodCategoryDao;
import com.yno.foodcyclebackend.entity.FoodCategory;
import com.yno.foodcyclebackend.entity.FoodListing;
import com.yno.foodcyclebackend.entity.FoodProvider;
import com.yno.foodcyclebackend.entity.ProviderOperatingHour;
import com.yno.foodcyclebackend.enums.OfferType;
import com.yno.foodcyclebackend.enums.ListingStatus;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.foodProvider.dao.FoodProviderDao;
import com.yno.foodcyclebackend.foodProvider.dao.ProviderOperatingHourDao;
import com.yno.foodcyclebackend.foodProvider.dto.request.CreateFoodListingRequest;
import com.yno.foodcyclebackend.foodProvider.dto.request.ProviderProfileRequest;
import com.yno.foodcyclebackend.foodProvider.dto.request.UpdateFoodListRequest;
import com.yno.foodcyclebackend.foodProvider.dto.response.FoodListingResponse;
import com.yno.foodcyclebackend.foodProvider.dto.response.ProviderProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class FoodProviderService {
    private final FoodProviderDao foodProviderDao;
    private final FoodListingDao foodListingDao;
    private final FoodCategoryDao foodCategoryDao;
    private final ProviderOperatingHourDao operatingHourDao;

    @Transactional
    public FoodListingResponse createListing(CreateFoodListingRequest request,
                                             Authentication authentication) {
        FoodProvider provider = getVerifiedProvider(authentication);
        validateSchedule(request.getExpiryTime(), request.getPickupDeadline());
        validateOffer(request.getOfferType(), request.getPriceAmount());

        FoodListing listing = new FoodListing();
        listing.setProvider(provider);
        copyFields(request, listing);
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

    @Transactional(readOnly = true)
    public List<FoodListingResponse> getAvailableListings() {
        return foodListingDao.findUrgentAvailableListings(LocalDateTime.now())
                .stream()
                .map(FoodListingResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProviderProfileResponse getMyProfile(Authentication authentication) {
        FoodProvider provider = getProvider(authentication);
        return ProviderProfileResponse.from(provider,
                operatingHourDao.findByProviderIdOrderByDayOfWeek(provider.getId()));
    }

    @Transactional
    public ProviderProfileResponse updateMyProfile(
            ProviderProfileRequest request, Authentication authentication) {
        FoodProvider provider = getProvider(authentication);
        validateOperatingHours(request.getOperatingHours());
        boolean identityChanged = !Objects.equals(provider.getBusinessName(), request.getBusinessName().trim())
                || !Objects.equals(provider.getAddress(), request.getAddress().trim())
                || !Objects.equals(provider.getContactNumber(), request.getContactNumber().trim())
                || provider.getProviderType() != request.getProviderType()
                || !Objects.equals(provider.getLicenseDocumentUrl(), request.getLicenseDocumentUrl().trim())
                || !Objects.equals(provider.getRegistrationNumber(), request.getRegistrationNumber().trim());
        provider.setBusinessName(request.getBusinessName().trim());
        provider.setAddress(request.getAddress().trim());
        provider.setContactNumber(request.getContactNumber().trim());
        provider.setProviderType(request.getProviderType());
        provider.setLicenseDocumentUrl(request.getLicenseDocumentUrl().trim());
        provider.setRegistrationNumber(request.getRegistrationNumber().trim());
        if (identityChanged && provider.getUser().getVerificationStatus() == VerificationStatus.VERIFIED) {
            provider.getUser().setVerificationStatus(VerificationStatus.PENDING);
        }

        operatingHourDao.deleteByProviderId(provider.getId());
        List<ProviderOperatingHour> hours = request.getOperatingHours().stream().map(hour -> {
            ProviderOperatingHour entity = new ProviderOperatingHour();
            entity.setProvider(provider);
            entity.setDayOfWeek(hour.getDayOfWeek());
            entity.setOpeningTime(hour.getOpeningTime());
            entity.setClosingTime(hour.getClosingTime());
            entity.setDonationStartTime(hour.getDonationStartTime());
            entity.setDonationEndTime(hour.getDonationEndTime());
            return entity;
        }).toList();
        return ProviderProfileResponse.from(provider, operatingHourDao.saveAll(hours));
    }

    @Transactional
    public FoodListingResponse updateListing(Long listingId,
                                             UpdateFoodListRequest request,
                                            Authentication authentication) {
        FoodProvider provider = getVerifiedProvider(authentication);
        FoodListing listing = getOwnedListing(listingId, provider);
        validateSchedule(request.getExpiryTime(), request.getPickupDeadline());
        validateOffer(request.getOfferType(), request.getPriceAmount());
        if (listing.getStatus() != ListingStatus.AVAILABLE) {
           throw new ResponseStatusException(BAD_REQUEST, "Only available listings can be updated");
        }
        copyFields(request, listing);
        listing.setUrgencyScore(calculateUrgencyScore(listing));
        return FoodListingResponse.from(foodListingDao.save(listing));
    }

    @Transactional
    public void deleteListing(Long listingId, Authentication authentication) {
        FoodProvider provider = getVerifiedProvider(authentication);
        FoodListing listing = getOwnedListing(listingId, provider);
        if (listing.getStatus() != ListingStatus.AVAILABLE) {
            throw new ResponseStatusException(BAD_REQUEST, "Only available listings can be deleted");
        }
        foodListingDao.delete(listing);
    }

    private FoodProvider getProvider(Authentication authentication) {
        return foodProviderDao.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Food Provider profile not found"));
    }

    private FoodProvider getVerifiedProvider(Authentication authentication) {
        FoodProvider provider = getProvider(authentication);

        if (provider.getUser().getVerificationStatus() != VerificationStatus.VERIFIED
            || !Boolean.TRUE.equals(provider.getUser().getIsActive())) {
            throw new AccessDeniedException("Food provider account is not approved");
        }
        return provider;
    }

    public FoodProvider getVerifiedProviderForClaims(Authentication authentication) {
        return getVerifiedProvider(authentication);
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
        listing.setImageUrl(request.getImageUrl());
        listing.setCategory(resolveCategory(request.getCategoryId()));
        listing.setQuantityKg(request.getQuantityKg());
        listing.setServingsEquivalent(request.getServingsEquivalent());
        listing.setOfferType(request.getOfferType() == null ? OfferType.DONATION : request.getOfferType());
        listing.setPriceAmount(request.getOfferType() == OfferType.DISCOUNTED_SALE
                ? request.getPriceAmount()
                : 0.0);
        listing.setPreparedTime(request.getPreparedTime());
        listing.setExpiryTime(request.getExpiryTime());
        listing.setPickupDeadline(request.getPickupDeadline());
    }

    public void copyFields(UpdateFoodListRequest request, FoodListing listing) {
        listing.setTitle(request.getTitle().trim());
        listing.setDescription(request.getDescription());
        listing.setImageUrl(request.getImageUrl());
        listing.setCategory(resolveCategory(request.getCategoryId()));
        listing.setQuantityKg(request.getQuantityKg());
        listing.setServingsEquivalent(request.getServingsEquivalent());
        listing.setOfferType(request.getOfferType() == null ? OfferType.DONATION : request.getOfferType());
        listing.setPriceAmount(request.getOfferType() == OfferType.DISCOUNTED_SALE
                ? request.getPriceAmount()
                : 0.0);
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

    private FoodCategory resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return foodCategoryDao.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Food category not found"));
    }

    private void validateOffer(OfferType offerType, Double priceAmount) {
        if (offerType == OfferType.DISCOUNTED_SALE && (priceAmount == null || priceAmount <= 0)) {
            throw new ResponseStatusException(BAD_REQUEST, "Discounted sale listings need a positive price");
        }
    }

    private void validateOperatingHours(List<ProviderProfileRequest.OperatingHourRequest> hours) {
        Set<java.time.DayOfWeek> days = new HashSet<>();
        for (ProviderProfileRequest.OperatingHourRequest hour : hours) {
            if (!days.add(hour.getDayOfWeek())) {
                throw new ResponseStatusException(BAD_REQUEST, "Operating hours must not repeat a day");
            }
            if (!hour.getOpeningTime().isBefore(hour.getClosingTime())) {
                throw new ResponseStatusException(BAD_REQUEST, "Closing time must be after opening time");
            }
            LocalTime donationStart = hour.getDonationStartTime();
            LocalTime donationEnd = hour.getDonationEndTime();
            if ((donationStart == null) != (donationEnd == null)
                    || donationStart != null
                    && (!donationStart.isBefore(donationEnd)
                    || donationStart.isBefore(hour.getOpeningTime())
                    || donationEnd.isAfter(hour.getClosingTime()))) {
                throw new ResponseStatusException(BAD_REQUEST,
                        "Donation hours must be a valid interval within operating hours");
            }
        }
    }
}
