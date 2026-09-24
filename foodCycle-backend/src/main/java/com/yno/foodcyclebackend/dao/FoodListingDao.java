package com.yno.foodcyclebackend.dao;

import com.yno.foodcyclebackend.entity.FoodListing;
import com.yno.foodcyclebackend.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FoodListingDao extends JpaRepository<FoodListing, Long> {
    // Status အလိုက် Food Listing များ ရှာရန်
    List<FoodListing> findByStatus(ListingStatus status);

    // Provider ID အလိုက် တင်ထားသော Food Listing များ ရှာရန်
    List<FoodListing> findByProviderId(Long providerId);

    // Business Logic 1: Expiry ကျော်သွားသော်လည်း EXPIRED Status မဖြစ်သေးသည်များကို ရှာရန် (Cron Job အတွက်)
    @Query("SELECT f FROM FoodListing f WHERE f.expiryTime <= :now AND f.status = 'AVAILABLE'")
    List<FoodListing> findExpiredListings(@Param("now") LocalDateTime now);

    // Business Logic 2: Urgency Score အမြင့်ဆုံး (Expiry နီးဆုံး) အစားအသောက်များကို ဦးစားပေး ရှာရန်
    @Query("SELECT f FROM FoodListing f WHERE f.status = 'AVAILABLE' AND f.expiryTime > :now ORDER BY f.urgencyScore DESC, f.expiryTime ASC")
    List<FoodListing> findUrgentAvailableListings(@Param("now") LocalDateTime now);
}
