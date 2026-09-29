package com.yno.foodcyclebackend.organization.service;

import com.yno.foodcyclebackend.organization.dao.OrganizationDao;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class OrganizationCapacityResetService {
    private final OrganizationDao organizationDao;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Yangon")
    @Transactional
    public void resetDailyCapacity() {
        organizationDao.resetDalyCapacity(LocalDate.now(ZoneId.of("Asia/Yangon")));
    }
}
