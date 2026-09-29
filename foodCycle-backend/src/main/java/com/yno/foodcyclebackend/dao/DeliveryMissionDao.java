package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.DeliveryMission;
import com.yno.foodcyclebackend.enums.MissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryMissionDao extends JpaRepository<DeliveryMission, Long> {

    List<DeliveryMission> findByVolunteerId(Long volunteerId);
    List<DeliveryMission> findByStatus(MissionStatus status);
    List<DeliveryMission> findByVolunteerIsNullAndStatus(MissionStatus status);
}
