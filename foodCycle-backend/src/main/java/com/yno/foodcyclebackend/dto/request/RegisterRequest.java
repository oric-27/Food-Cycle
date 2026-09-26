package com.yno.foodcyclebackend.dto.request;

import com.yno.foodcyclebackend.enums.ProviderType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
    private String registrationNumber;
    private String dailyCapacityServings;
    private Boolean isAvailable;
}
