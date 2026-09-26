package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodCategoryDao extends JpaRepository<FoodCategory, Long> {
    boolean existsByNameIgnoreCase(String name);
}
