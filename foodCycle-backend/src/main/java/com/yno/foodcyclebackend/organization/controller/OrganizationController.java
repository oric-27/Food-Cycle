package com.yno.foodcyclebackend.organization.controller;

import com.yno.foodcyclebackend.organization.dto.request.OrganizationProfileRequest;
import com.yno.foodcyclebackend.organization.dto.request.UpdateOrganizationCapacityRequest;
import com.yno.foodcyclebackend.organization.dto.response.OrganizationProfileResponse;
import com.yno.foodcyclebackend.organization.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/organizations")
@PreAuthorize("hasAuthority('ORGANIZATION')")
public class OrganizationController {
    private final OrganizationService organizationService;

    @GetMapping("/profile")
    public ResponseEntity<OrganizationProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(organizationService.getProfile(authentication));
    }

    @PutMapping("/profile")
    public ResponseEntity<OrganizationProfileResponse> updateProfile(
            @Valid @RequestBody OrganizationProfileRequest request, Authentication authentication) {
        return ResponseEntity.ok(organizationService.updateMyProfile(request, authentication));
    }

    @PutMapping("/capacity")
    public ResponseEntity<OrganizationProfileResponse> updateCapacity(
            @Valid @RequestBody UpdateOrganizationCapacityRequest request, Authentication authentication) {
        return ResponseEntity.ok(organizationService.updateCapacity(request.getDailyCapacityServings(), authentication));
    }


}
