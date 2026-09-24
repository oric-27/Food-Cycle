package com.yno.foodcyclebackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "impact_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImpactReport extends BaseEntity {

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "rescued_food_kg")
    private Double rescuedFoodKg;

    @Column(name = "rescued_meals")
    private Integer rescuedMeals;

    @Column(name = "total_beneficiaries")
    private Integer totalBeneficiaries;

    @Column(name = "active_providers")
    private Integer activeProviders;

    @Column(name = "active_ngos")
    private Integer activeNgos;

    @Column(name = "completed_deliveries")
    private Integer completedDeliveries;
}