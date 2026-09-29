package com.yno.foodcyclebackend.organization.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizationProfileRequest {
    @NotBlank
    private String organizationName;

    @NotBlank
    private String address;

    @NotBlank
    private String contactNumber;

    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String licenseDocumentUrl;

    @PositiveOrZero
    private Integer dailyCapacityServings;
}
