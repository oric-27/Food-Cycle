package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.ImpactReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ImpactReportDao extends JpaRepository<ImpactReport, Long> {
    Optional<ImpactReport> findTopByOrderByReportDateDesc();

    @Query("""
        SELECT SUM(f.quantityKg) FROM FoodListing f WHERE f.status = 'DELIVERED'
    """)
    Double calculateTotalRescuedFoodKg();
}
