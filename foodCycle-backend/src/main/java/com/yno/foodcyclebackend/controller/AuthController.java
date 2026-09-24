package com.yno.foodcyclebackend.controller;

import com.yno.foodcyclebackend.dto.request.LoginRequest;
import com.yno.foodcyclebackend.dto.request.RegisterRequest;
import com.yno.foodcyclebackend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        authService.login(request);
        return ResponseEntity.ok("Login successful!");
    }


}
