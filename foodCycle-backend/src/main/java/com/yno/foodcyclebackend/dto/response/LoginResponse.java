package com.yno.foodcyclebackend.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private Long id;
    private String username;
    private String email;
    private String roleName;
    private String message;
}
