package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VolunteerDao extends JpaRepository<Volunteer, Long> {
    List<Volunteer> findByIsAvailableTrue();
}
