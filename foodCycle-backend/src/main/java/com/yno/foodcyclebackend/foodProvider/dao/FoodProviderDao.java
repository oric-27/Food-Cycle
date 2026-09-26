package com.yno.foodcyclebackend.foodProvider.dao;

import com.yno.foodcyclebackend.entity.FoodProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodProviderDao extends JpaRepository<FoodProvider, Long> {
    Optional<FoodProvider> findByUserEmail(String email);
}
