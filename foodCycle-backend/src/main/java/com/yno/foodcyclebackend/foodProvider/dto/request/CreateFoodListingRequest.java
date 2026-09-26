package com.yno.foodcyclebackend.foodProvider.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateFoodListingRequest {
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

    @NotNull
    @Future
    private LocalDateTime expiryTime;

    @NotNull
    @Future
    private LocalDateTime pickupDeadline;
}
