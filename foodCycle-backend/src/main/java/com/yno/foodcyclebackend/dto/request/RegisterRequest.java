package com.yno.foodcyclebackend.dto.request;

import com.yno.foodcyclebackend.enums.ProviderType;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String username;
    @NotBlank
    @Email
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String roleName;
    private String address;
    private ProviderType providerType;
    private String businessName;
    @JsonAlias("contentNumber")
    private String contactNumber;
    private String licenseDocumentUrl;
    private String registrationNumber;
    @PositiveOrZero
    private Integer dailyCapacityServings;
    private String organizationName;
    private Boolean isAvailable;
}
