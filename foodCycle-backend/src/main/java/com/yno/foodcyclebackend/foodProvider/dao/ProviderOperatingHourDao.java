package com.yno.foodcyclebackend.foodProvider.dao;

import com.yno.foodcyclebackend.entity.ProviderOperatingHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderOperatingHourDao extends JpaRepository<ProviderOperatingHour, Long> {
    List<ProviderOperatingHour> findByProviderIdOrderByDayOfWeek(Long providerId);
    void deleteByProviderId(Long providerId);
}
