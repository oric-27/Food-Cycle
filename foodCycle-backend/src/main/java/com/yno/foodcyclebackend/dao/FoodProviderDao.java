package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.FoodProvider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodProviderDao extends JpaRepository<FoodProvider, Long> {
}
