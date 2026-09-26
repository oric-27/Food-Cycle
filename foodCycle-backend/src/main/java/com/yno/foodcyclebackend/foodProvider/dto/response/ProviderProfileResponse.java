package com.yno.foodcyclebackend.foodProvider.dto.response;

import com.yno.foodcyclebackend.entity.FoodProvider;
import com.yno.foodcyclebackend.entity.ProviderOperatingHour;
import com.yno.foodcyclebackend.enums.ProviderType;
import com.yno.foodcyclebackend.enums.VerificationStatus;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public record ProviderProfileResponse(
        String businessName,
        String address,
        String contactNumber,
        ProviderType providerType,
        String licenseDocumentUrl,
        String registrationNumber,
        VerificationStatus verificationStatus,
        List<OperatingHourResponse> operatingHours
) {
    public static ProviderProfileResponse from(FoodProvider provider, List<ProviderOperatingHour> hours) {
        return new ProviderProfileResponse(
                provider.getBusinessName(),
                provider.getAddress(),
                provider.getContactNumber(),
                provider.getProviderType(),
                provider.getLicenseDocumentUrl(),
                provider.getRegistrationNumber(),
                provider.getUser().getVerificationStatus(),
                hours.stream().map(OperatingHourResponse::from).toList()
        );
    }

    public record OperatingHourResponse(
            DayOfWeek dayOfWeek,
            LocalTime openingTime,
            LocalTime closingTime,
            LocalTime donationStartTime,
            LocalTime donationEndTime
    ) {
        static OperatingHourResponse from(ProviderOperatingHour hour) {
            return new OperatingHourResponse(
                    hour.getDayOfWeek(),
                    hour.getOpeningTime(),
                    hour.getClosingTime(),
                    hour.getDonationStartTime(),
                    hour.getDonationEndTime()
            );
        }
    }
}
