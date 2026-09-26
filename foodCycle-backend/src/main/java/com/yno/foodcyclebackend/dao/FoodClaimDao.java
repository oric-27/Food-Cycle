package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.FoodClaim;
import com.yno.foodcyclebackend.enums.ClaimStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FoodClaimDao extends JpaRepository<FoodClaim, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM FoodClaim c WHERE c.id = :id")
    Optional<FoodClaim> findByIdForUpdate(@Param("id") Long id);

    List<FoodClaim> findByOrganizationId(Long organizationId);

    List<FoodClaim> findByFoodListingIdOrderByCreatedAtDesc(Long foodListingId);

    List<FoodClaim> findByStatus(ClaimStatus status);
    List<FoodClaim> findByFoodListingProviderIdOrderByCreatedAtDesc(Long providerId);
}
