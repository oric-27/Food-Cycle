package com.yno.foodcyclebackend.foodProvider.dto.response;

import com.yno.foodcyclebackend.entity.FoodListing;

import java.time.LocalDateTime;

public record FoodListingResponse (
        Long id,
        String title,
        String description,
        Double quantityKg,
        Integer servingsEquivalent,
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
                listing.getQuantityKg(),
                listing.getServingsEquivalent(),
                listing.getPreparedTime(),
                listing.getExpiryTime(),
                listing.getPickupDeadline(),
                listing.getUrgencyScore(),
                listing.getStatus().name()
        );
    }
}
