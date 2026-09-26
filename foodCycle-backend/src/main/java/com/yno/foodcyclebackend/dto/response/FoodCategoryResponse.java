package com.yno.foodcyclebackend.dto.response;

import com.yno.foodcyclebackend.entity.FoodCategory;

public record FoodCategoryResponse(Long id, String name, String description) {
    public static FoodCategoryResponse from(FoodCategory category) {
        return new FoodCategoryResponse(category.getId(), category.getName(), category.getDescription());
    }
}
