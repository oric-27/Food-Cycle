package com.yno.foodcyclebackend.organization.dao;

import com.yno.foodcyclebackend.organization.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrganizationDao extends JpaRepository<Organization, Long> {
    Optional<Organization> findByUserEmail(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Organization o WHERE o.user.email = :email")
    Optional<Organization> findByUserEmailForUpdate(@Param("email") String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM Organization o WHERE o.id = :id")
    Optional<Organization> findByIdForUpdate(@Param("id") Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Organization o
        SET o.remainingCapacityServings = o.dailyCapacityServings,
            o.capacityResetDate = :today
        WHERE o.dailyCapacityServings IS NOT NULL
            AND (o.capacityResetDate IS NULL OR o.capacityResetDate < :today)
    """)
    int resetDalyCapacity(@Param("today")LocalDate today);

    // Remaining Capacity ရှိနေသေးသော NGO များကို ရှာရန်
    @Query("SELECT o FROM Organization o WHERE o.remainingCapacityServings >= :requestedServings")
    List<Organization> findOrganizationsWithAvailableCapacity(@Param("requestedServings") Integer requestedServings);
}
