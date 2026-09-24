package com.yno.foodcyclebackend.entity;

import com.yno.foodcyclebackend.enums.RoleName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "roles")
public class Role extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false, unique = true)
    private RoleName roleName;
}
