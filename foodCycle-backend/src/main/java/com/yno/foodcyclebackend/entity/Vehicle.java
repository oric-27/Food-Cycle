package com.yno.foodcyclebackend.entity;

import com.yno.foodcyclebackend.enums.VehicleType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle extends  BaseEntity {

    @OneToOne
    @JoinColumn(name = "volunteer_id", nullable = false, unique = true)
    private Volunteer volunteer;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    private VehicleType vehicleType;

    @Column(name = "capacity_kg")
    private Double capacityKg;

    private String licensePlate;

}