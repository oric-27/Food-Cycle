package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.User;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserDao extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    List<User> findByVerificationStatus(VerificationStatus status);
}
