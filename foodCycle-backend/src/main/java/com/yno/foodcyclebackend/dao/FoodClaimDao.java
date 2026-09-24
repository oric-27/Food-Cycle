package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.FoodClaim;
import com.yno.foodcyclebackend.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface FoodClaimDao extends JpaRepository<FoodClaim, Long> {
    List<FoodClaim> findByOrganizationId(Long organizationId);

    Optional<FoodClaim> findByFoodListingId(Long foodListingId);

    List<FoodClaim> findByStatus(ClaimStatus status);
}
