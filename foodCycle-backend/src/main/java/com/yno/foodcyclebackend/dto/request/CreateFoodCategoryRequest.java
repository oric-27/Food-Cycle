package com.yno.foodcyclebackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFoodCategoryRequest {
    @NotBlank
    private String name;

    private String description;
}
