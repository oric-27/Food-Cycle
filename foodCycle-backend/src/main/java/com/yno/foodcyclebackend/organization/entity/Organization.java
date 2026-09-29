package com.yno.foodcyclebackend.organization.entity;

import com.yno.foodcyclebackend.entity.BaseEntity;
import com.yno.foodcyclebackend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "organizations")
public class Organization extends BaseEntity {

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "organization_name")
    private String organizationName;

    @Column(name = "content_number")
    private String contactNumber;

    @Column(name = "license_document_url")
    private String licenseDocumentUrl;

    @Column(name = "daily_capacity_servings")
    private Integer dailyCapacityServings;

    @Column(name = "remaining_capacity_servings")
    private Integer remainingCapacityServings;

    private String address;

    @Column(name = "capacity_reset_date")
    private LocalDate capacityResetDate;
}
