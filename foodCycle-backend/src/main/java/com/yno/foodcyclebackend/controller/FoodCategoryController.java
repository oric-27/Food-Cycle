package com.yno.foodcyclebackend.controller;

import com.yno.foodcyclebackend.dao.FoodCategoryDao;
import com.yno.foodcyclebackend.dto.request.CreateFoodCategoryRequest;
import com.yno.foodcyclebackend.dto.response.FoodCategoryResponse;
import com.yno.foodcyclebackend.entity.FoodCategory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.CONFLICT;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/food-categories")
public class FoodCategoryController {
    private final FoodCategoryDao foodCategoryDao;

    @GetMapping
    public ResponseEntity<List<FoodCategoryResponse>> getCategories() {
        return ResponseEntity.ok(foodCategoryDao.findAll().stream()
                .map(FoodCategoryResponse::from)
                .toList());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<FoodCategoryResponse> createCategory(
            @Valid @RequestBody CreateFoodCategoryRequest request) {
        String name = request.getName().trim();
        if (foodCategoryDao.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(CONFLICT, "Food category already exists");
        }
        FoodCategory category = new FoodCategory();
        category.setName(name);
        category.setDescription(request.getDescription());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(FoodCategoryResponse.from(foodCategoryDao.save(category)));
    }
}
