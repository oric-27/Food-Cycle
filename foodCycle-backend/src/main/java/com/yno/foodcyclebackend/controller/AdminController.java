package com.yno.foodcyclebackend.controller;

import com.yno.foodcyclebackend.dao.UserDao;
import com.yno.foodcyclebackend.enums.RoleName;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.foodProvider.dao.FoodProviderDao;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserDao userDao;
    private final FoodProviderDao foodProviderDao;

    @PostMapping("/users/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public ResponseEntity<String> approveUser(@PathVariable Long id) {
        var user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        boolean foodProviderAccount = user.getRoles().stream()
                .anyMatch(role -> role.getRoleName() == RoleName.FOOD_PROVIDER);
        if (foodProviderAccount) {
            var provider = foodProviderDao.findByUserEmail(user.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Food Provider profile not found"));
            if (isBlank(provider.getBusinessName()) || isBlank(provider.getAddress())
                    || isBlank(provider.getContactNumber()) || isBlank(provider.getRegistrationNumber())
                    || isBlank(provider.getLicenseDocumentUrl())) {
                throw new ResponseStatusException(
                        BAD_REQUEST, "Food Provider business profile and license document are required");
            }
        }
        user.setVerificationStatus(VerificationStatus.VERIFIED);
        return ResponseEntity.ok("User " + id + " approved successfully");
    }

    @PostMapping("/users/{id}/reject")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public ResponseEntity<String> rejectUser(@PathVariable Long id) {
        var user = userDao.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        user.setVerificationStatus(VerificationStatus.REJECTED);
        return ResponseEntity.ok("User " + id + " rejected");
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

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
