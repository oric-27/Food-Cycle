package com.yno.foodcyclebackend.service;

import com.yno.foodcyclebackend.dao.FoodListingDao;
import com.yno.foodcyclebackend.enums.ListingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FoodListingExpiryService {
    private final FoodListingDao foodListingDao;

    @Scheduled(fixedDelay = 60_000)
    @Transactional
    public void expireListings() {
        var expiredListings = foodListingDao.findExpiredListings(LocalDateTime.now());
        expiredListings.forEach(listing -> listing.setStatus(ListingStatus.EXPIRED));
        foodListingDao.saveAll(expiredListings);
    }
}
