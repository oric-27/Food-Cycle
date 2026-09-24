package com.yno.foodcyclebackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    @PostMapping("/users/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> approveUser(@PathVariable Long id) {
        return ResponseEntity.ok("User " + id + " approved successfully");
    }

    @PostMapping("/users/{id}/assign-role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> assignRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String role = request.get("role");
        return ResponseEntity.ok("Role " + role + " assigned to user " + id);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> getAllUsers() {
        return ResponseEntity.ok("List of all users");
    }
}
