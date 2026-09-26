package com.yno.foodcyclebackend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFoodClaimRequest {
    @NotNull
    private Long listingId;

    @NotNull
    @Positive
    private Integer claimedServings;
}
