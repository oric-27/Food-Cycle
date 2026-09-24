package com.yno.foodcyclebackend.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

public record LoginResponse(
        String token,
        String type,
        String email,
        List<String> roles
) {}
