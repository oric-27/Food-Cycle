package com.yno.foodcyclebackend.foodProvider.dto.request;

import com.yno.foodcyclebackend.enums.ProviderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class ProviderProfileRequest {
    @NotBlank
    private String businessName;

    @NotBlank
    private String address;

    @NotBlank
    private String contactNumber;

    @NotNull
    private ProviderType providerType;

    @NotBlank
    private String licenseDocumentUrl;

    @NotBlank
    private String registrationNumber;

    @NotNull
    @Valid
    private List<OperatingHourRequest> operatingHours = List.of();

    @Getter
    @Setter
    public static class OperatingHourRequest {
        @NotNull
        private DayOfWeek dayOfWeek;

        @NotNull
        private LocalTime openingTime;

        @NotNull
        private LocalTime closingTime;

        private LocalTime donationStartTime;
        private LocalTime donationEndTime;
    }
}
