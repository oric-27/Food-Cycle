package com.yno.foodcyclebackend.foodProvider.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateFoodListRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    @Positive
    private Double quantityKg;

    @NotNull
    @Positive
    private Integer servingsEquivalent;

    private LocalDateTime preparedTime;

    @NonNull
    @Future
    private LocalDateTime expiryTime;

    @NonNull
    @Future
    private LocalDateTime pickupDeadline;

}
