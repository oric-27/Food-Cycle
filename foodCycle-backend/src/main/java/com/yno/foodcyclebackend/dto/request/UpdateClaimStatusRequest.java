package com.yno.foodcyclebackend.dto.request;

import com.yno.foodcyclebackend.enums.ClaimStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateClaimStatusRequest {
    @NotNull
    private ClaimStatus status;
}
