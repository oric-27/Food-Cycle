package com.yno.foodcyclebackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "beneficiary_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryRequest extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "requested_servings", nullable = false)
    private Integer requestedServings;

    private String targetGroup; // ဥပမာ- Orphanage, Elderly Home

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.OPEN;

    public enum RequestStatus {
        OPEN, FULFILLED, CANCELLED
    }
}