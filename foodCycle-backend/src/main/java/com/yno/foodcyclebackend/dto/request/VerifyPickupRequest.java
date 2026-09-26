package com.yno.foodcyclebackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyPickupRequest {
    @NotBlank
    private String otp;
}
