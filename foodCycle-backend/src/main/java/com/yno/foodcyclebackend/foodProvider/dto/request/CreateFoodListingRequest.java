package com.yno.foodcyclebackend.foodProvider.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import com.yno.foodcyclebackend.enums.OfferType;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateFoodListingRequest {
    @NotBlank
    private String title;

    private String description;

    private String imageUrl;

    private Long categoryId;

    @NotNull
    @Positive
    private Double quantityKg;

    @NotNull
    @Positive
    private Integer servingsEquivalent;

    private OfferType offerType;

    private Double priceAmount;

    private LocalDateTime preparedTime;

    @NotNull
    @Future
    private LocalDateTime expiryTime;

    @NotNull
    @Future
    private LocalDateTime pickupDeadline;
}
