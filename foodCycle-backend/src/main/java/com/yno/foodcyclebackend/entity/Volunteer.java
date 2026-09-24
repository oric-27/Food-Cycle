package com.yno.foodcyclebackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "volunteers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Volunteer extends BaseEntity {

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @OneToOne(mappedBy = "volunteer", cascade = CascadeType.ALL)
    private Vehicle vehicle;
}