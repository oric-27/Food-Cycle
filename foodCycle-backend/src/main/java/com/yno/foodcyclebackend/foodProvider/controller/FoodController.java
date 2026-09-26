package com.yno.foodcyclebackend.foodProvider.controller;

import com.yno.foodcyclebackend.foodProvider.dto.request.CreateFoodListingRequest;
import com.yno.foodcyclebackend.foodProvider.dto.request.UpdateFoodListRequest;
import com.yno.foodcyclebackend.foodProvider.dto.request.ProviderProfileRequest;
import com.yno.foodcyclebackend.foodProvider.dto.response.FoodListingResponse;
import com.yno.foodcyclebackend.foodProvider.dto.response.ProviderProfileResponse;
import com.yno.foodcyclebackend.dto.request.UpdateClaimStatusRequest;
import com.yno.foodcyclebackend.dto.request.VerifyPickupRequest;
import com.yno.foodcyclebackend.dto.response.FoodClaimResponse;
import com.yno.foodcyclebackend.service.FoodClaimService;
import com.yno.foodcyclebackend.service.ProviderAnalyticsService;
import com.yno.foodcyclebackend.dto.response.ProviderFinancialReportResponse;
import com.yno.foodcyclebackend.foodProvider.service.FoodProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/food-providers")
public class FoodController {
    private final FoodProviderService foodProviderService;
    private final FoodClaimService foodClaimService;
    private final ProviderAnalyticsService providerAnalyticsService;

    @GetMapping("/profile")
    public ResponseEntity<ProviderProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(foodProviderService.getMyProfile(authentication));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProviderProfileResponse> updateProfile(
            @Valid @RequestBody ProviderProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(foodProviderService.updateMyProfile(request, authentication));
    }

    @PostMapping("/listings")
    public ResponseEntity<FoodListingResponse> createListing(
            @Valid @RequestBody CreateFoodListingRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(foodProviderService.createListing(request,authentication));
    }

    @GetMapping("/listings")
    public ResponseEntity<List<FoodListingResponse>> getMyListings(Authentication authentication) {
        return ResponseEntity.ok(foodProviderService.getMyListings(authentication));
    }

    @GetMapping("/listings/available")
    public ResponseEntity<List<FoodListingResponse>> getAvailableListings() {
        return ResponseEntity.ok(foodProviderService.getAvailableListings());
    }

    @PutMapping("/listings/{listingId}")
    public ResponseEntity<FoodListingResponse> updateListing(
            @PathVariable Long listingId,
            @Valid @RequestBody UpdateFoodListRequest request,
            Authentication authentication){
        return ResponseEntity.ok(foodProviderService.updateListing(listingId, request, authentication));
    }

    @DeleteMapping("/listings/{listingId}")
    public ResponseEntity<Void> deleteListing(
            @PathVariable Long listingId,
            Authentication authentication){
        foodProviderService.deleteListing(listingId, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/claims")
    public ResponseEntity<List<FoodClaimResponse>> getClaims(Authentication authentication) {
        return ResponseEntity.ok(foodClaimService.getProviderClaims(authentication));
    }

    @PutMapping("/claims/{claimId}/status")
    public ResponseEntity<FoodClaimResponse> updateClaimStatus(
            @PathVariable Long claimId,
            @Valid @RequestBody UpdateClaimStatusRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(foodClaimService.updateStatus(claimId, request.getStatus(), authentication));
    }

    @PostMapping("/claims/{claimId}/verify-pickup")
    public ResponseEntity<FoodClaimResponse> verifyPickup(
            @PathVariable Long claimId,
            @Valid @RequestBody VerifyPickupRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(foodClaimService.verifyPickup(claimId, request.getOtp(), authentication));
    }

    @PostMapping("/claims/{claimId}/pickup-otp")
    public ResponseEntity<FoodClaimResponse> regeneratePickupOtp(
            @PathVariable Long claimId,
            Authentication authentication) {
        return ResponseEntity.ok(foodClaimService.regeneratePickupOtp(claimId, authentication));
    }

    @GetMapping("/reports/impact")
    public ResponseEntity<ProviderFinancialReportResponse> getImpactReport(Authentication authentication) {
        return ResponseEntity.ok(providerAnalyticsService.getReport(authentication));
    }
}
