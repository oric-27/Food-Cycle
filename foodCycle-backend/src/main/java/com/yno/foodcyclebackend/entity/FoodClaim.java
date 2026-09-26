package com.yno.foodcyclebackend.entity;

import com.yno.foodcyclebackend.enums.ClaimStatus;
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
@Table(name = "food_claims")
public class FoodClaim extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_listing_id", nullable = false)
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "claimed_servings", nullable = false)
    private Integer claimedServings;

    @Column(name = "total_price")
    private Double totalPrice = 0.0;

    @Column(name = "pickup_otp_hash")
    private String pickupOtpHash;

    @Column(name = "pickup_otp_expires_at")
    private LocalDateTime pickupOtpExpiresAt;

    @Column(name = "pickup_otp_attempts")
    private Integer pickupOtpAttempts = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.REQUESTED;

}
