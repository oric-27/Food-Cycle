package com.yno.foodcyclebackend.foodProvider.dto.response;

import com.yno.foodcyclebackend.entity.FoodListing;
import com.yno.foodcyclebackend.enums.OfferType;

import java.time.LocalDateTime;

public record FoodListingResponse (
        Long id,
        String title,
        String description,
        String imageUrl,
        Long categoryId,
        String categoryName,
        Double quantityKg,
        Integer servingsEquivalent,
        OfferType offerType,
        Double priceAmount,
        LocalDateTime preparedTime,
        LocalDateTime expiryTime,
        LocalDateTime pickUpDeadLine,
        Double urgencyScore,
        String status
) {
    public static FoodListingResponse from(FoodListing listing) {
        return new FoodListingResponse(
                listing.getId(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getImageUrl(),
                listing.getCategory() == null ? null : listing.getCategory().getId(),
                listing.getCategory() == null ? null : listing.getCategory().getName(),
                listing.getQuantityKg(),
                listing.getServingsEquivalent(),
                listing.getOfferType() == null ? OfferType.DONATION : listing.getOfferType(),
                listing.getPriceAmount() == null ? 0.0 : listing.getPriceAmount(),
                listing.getPreparedTime(),
                listing.getExpiryTime(),
                listing.getPickupDeadline(),
                listing.getUrgencyScore(),
                listing.getStatus().name()
        );
    }
}
