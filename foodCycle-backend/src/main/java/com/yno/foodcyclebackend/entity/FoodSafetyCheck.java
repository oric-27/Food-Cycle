package com.yno.foodcyclebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "food_safety_checks")
public class FoodSafetyCheck extends  BaseEntity {
    @OneToOne
    @MapsId
    @JoinColumn(name = "food_listing_id")
    private FoodListing foodListing;

    @Column(name = "storage_condition")
    private String storageCondition;

    @Column(name = "allergen_info")
    private String allergenInfo;

    @Column(name = "is_packaging_intact")
    private Boolean isPackagingIntact;

    @Column(name = "is_passed", nullable = false)
    private Boolean isPassed = true;

    private String remarks;
}
