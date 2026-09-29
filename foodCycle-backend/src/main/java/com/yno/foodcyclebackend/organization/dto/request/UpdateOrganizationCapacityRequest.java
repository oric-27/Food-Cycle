package com.yno.foodcyclebackend.organization.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrganizationCapacityRequest {
    @NotNull
    @PositiveOrZero
    private Integer dailyCapacityServings;
}
