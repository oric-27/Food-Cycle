package com.yno.foodcyclebackend.controller;

import com.yno.foodcyclebackend.dto.request.CreateFoodClaimRequest;
import com.yno.foodcyclebackend.dto.response.FoodClaimResponse;
import com.yno.foodcyclebackend.service.FoodClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/food-claims")
public class FoodClaimController {
    private final FoodClaimService foodClaimService;

    @PostMapping
    public ResponseEntity<FoodClaimResponse> createClaim(
            @Valid @RequestBody CreateFoodClaimRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(foodClaimService.createClaim(request, authentication));
    }

    @GetMapping
    public ResponseEntity<List<FoodClaimResponse>> getMyClaims(Authentication authentication) {
        return ResponseEntity.ok(foodClaimService.getMyClaims(authentication));
    }

    @PostMapping("/{claimId}/cancel")
    public ResponseEntity<Void> cancelClaim(
            @PathVariable Long claimId,
            Authentication authentication) {
        foodClaimService.cancelClaim(claimId, authentication);
        return ResponseEntity.noContent().build();
    }
}
