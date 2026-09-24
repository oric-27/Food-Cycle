package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.Role;
import com.yno.foodcyclebackend.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleDao extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(RoleName name);
}
