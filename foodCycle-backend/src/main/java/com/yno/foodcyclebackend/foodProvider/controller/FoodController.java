package com.yno.foodcyclebackend.foodProvider.controller;

import com.yno.foodcyclebackend.foodProvider.dto.request.CreateFoodListingRequest;
import com.yno.foodcyclebackend.foodProvider.dto.request.UpdateFoodListRequest;
import com.yno.foodcyclebackend.foodProvider.dto.response.FoodListingResponse;
import com.yno.foodcyclebackend.foodProvider.service.FoodProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.Update;
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

    @GetMapping("/test")
    public ResponseEntity<String> test(Authentication authentication) {
        return ResponseEntity.ok("Test endpoint reached. User: " + authentication.getName());
    }

    @PostMapping("/test")
    public ResponseEntity<String> testPost(Authentication authentication) {
        return ResponseEntity.ok("Test POST endpoint reached. User: " + authentication.getName());
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
}
