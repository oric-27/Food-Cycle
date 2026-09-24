package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrganizationDao extends JpaRepository<Organization, Long> {
    // Remaining Capacity ရှိနေသေးသော NGO များကို ရှာရန်
    @Query("SELECT o FROM Organization o WHERE o.remainingCapacityServings >= :requestedServings")
    List<Organization> findOrganizationsWithAvailableCapacity(@Param("requestedServings") Integer requestedServings);
}
