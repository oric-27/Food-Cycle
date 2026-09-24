package com.yno.foodcyclebackend.entity;

import com.yno.foodcyclebackend.enums.ClaimStatus;
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
@Table(name = "food_claims")
public class FoodClaim extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "food_listing_id", nullable = false, unique = true)
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "claimed_servings", nullable = false)
    private Integer claimedServings;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.REQUESTED;

}
