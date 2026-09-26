package com.yno.foodcyclebackend.dto.response;

import com.yno.foodcyclebackend.entity.FoodClaim;
import com.yno.foodcyclebackend.enums.ClaimStatus;

import java.time.LocalDateTime;

public record FoodClaimResponse(
        Long id,
        Long listingId,
        String listingTitle,
        Integer claimedServings,
        Double totalPrice,
        ClaimStatus status,
        LocalDateTime createdAt,
        String pickupOtp
) {
    public static FoodClaimResponse from(FoodClaim claim) {
        return from(claim, null);
    }

    public static FoodClaimResponse from(FoodClaim claim, String pickupOtp) {
        return new FoodClaimResponse(
                claim.getId(),
                claim.getFoodListing().getId(),
                claim.getFoodListing().getTitle(),
                claim.getClaimedServings(),
                claim.getTotalPrice() == null ? 0.0 : claim.getTotalPrice(),
                claim.getStatus(),
                claim.getCreatedAt(),
                pickupOtp
        );
    }
}
