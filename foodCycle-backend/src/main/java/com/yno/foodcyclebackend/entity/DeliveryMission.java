package com.yno.foodcyclebackend.entity;

import com.yno.foodcyclebackend.enums.MissionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_missions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryMission extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "claim_id", nullable = false, unique = true)
    private FoodClaim foodClaim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @Column(name = "pickup_proof_url")
    private String pickupProofUrl;

    @Column(name = "delivery_proof_url")
    private String deliveryProofUrl;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MissionStatus status = MissionStatus.ASSIGNED;


}
