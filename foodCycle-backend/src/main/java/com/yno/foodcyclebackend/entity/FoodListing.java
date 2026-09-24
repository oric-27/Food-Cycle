package com.yno.foodcyclebackend.entity;

import com.yno.foodcyclebackend.enums.ListingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "food_listings")
public class FoodListing extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private FoodProvider provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private FoodCategory category;

    @Column(nullable = false)
    private String title;

    private String description;
    @Column(name = "quantity_kg", nullable = false)
    private Double quantityKg;

    @Column(name = "servings_equivalent", nullable = false)
    private Integer servingsEquivalent; // 1 kg = 8 servings rule တွက်ထားသည့် တန်ဖိုး

    @Column(name = "prepared_time")
    private LocalDateTime preparedTime;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "pickup_deadline", nullable = false)
    private LocalDateTime pickupDeadline;

    @Column(name = "urgency_score")
    private Double urgencyScore = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status = ListingStatus.AVAILABLE;

    @OneToOne(mappedBy = "foodListing", cascade = CascadeType.ALL)
    private FoodSafetyCheck safetyCheck;
}
