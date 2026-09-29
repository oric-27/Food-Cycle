package com.yno.foodcyclebackend.organization.dto.response;

import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.organization.entity.Organization;

public record OrganizationProfileResponse(
        String organizationName,
        String address,
        String contentNumber,
        String registrationNumber,
        String licenseDocumentUrl,
        Integer dailyCapacityServings,
        Integer remainingCapacityServings,
        VerificationStatus verificationStatus,
        boolean active
) {
    public static OrganizationProfileResponse from(Organization organization) {
        return new OrganizationProfileResponse(
                organization.getOrganizationName(),
                organization.getAddress(),
                organization.getContactNumber(),
                organization.getRegistrationNumber(),
                organization.getLicenseDocumentUrl(),
                organization.getDailyCapacityServings(),
                organization.getRemainingCapacityServings(),
                organization.getUser().getVerificationStatus(),
                organization.getUser().getIsActive()
        );
    }

}
