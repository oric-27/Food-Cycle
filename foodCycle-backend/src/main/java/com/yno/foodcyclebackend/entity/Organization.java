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
@Table(name = "organizations")
public class Organization extends BaseEntity{

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "daily_capacity_servings")
    private Integer dailyCapacityServings;

    @Column(name = "remaining_capacity_servings")
    private Integer remainingCapacityServings;

    private String address;
}
