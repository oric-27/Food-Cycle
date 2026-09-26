package com.yno.foodcyclebackend.service;

import com.yno.foodcyclebackend.dao.FoodClaimDao;
import com.yno.foodcyclebackend.dto.response.ProviderFinancialReportResponse;
import com.yno.foodcyclebackend.dto.response.ProviderImpactReportResponse;
import com.yno.foodcyclebackend.entity.FoodClaim;
import com.yno.foodcyclebackend.enums.ClaimStatus;
import com.yno.foodcyclebackend.enums.OfferType;
import com.yno.foodcyclebackend.foodProvider.service.FoodProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderAnalyticsService {
    private final FoodClaimDao foodClaimDao;
    private final FoodProviderService foodProviderService;

    @Transactional(readOnly = true)
    public ProviderFinancialReportResponse getReport(Authentication authentication) {
        var provider = foodProviderService.getVerifiedProviderForClaims(authentication);
        List<FoodClaim> completedClaims = foodClaimDao
                .findByFoodListingProviderIdOrderByCreatedAtDesc(provider.getId())
                .stream()
                .filter(claim -> claim.getStatus() == ClaimStatus.COMPLETED)
                .toList();

        long servings = completedClaims.stream().mapToLong(FoodClaim::getClaimedServings).sum();
        double rescuedKg = completedClaims.stream()
                .mapToDouble(ProviderAnalyticsService::rescuedKilograms)
                .sum();
        long donations = completedClaims.stream()
                .filter(claim -> offerType(claim) == OfferType.DONATION)
                .count();
        long sales = completedClaims.stream()
                .filter(claim -> offerType(claim) == OfferType.DISCOUNTED_SALE)
                .count();
        double revenue = completedClaims.stream()
                .filter(claim -> offerType(claim) == OfferType.DISCOUNTED_SALE)
                .mapToDouble(claim -> claim.getTotalPrice() == null ? 0.0 : claim.getTotalPrice())
                .sum();

        List<ProviderFinancialReportResponse.HistoryEntry> history = completedClaims.stream()
                .map(claim -> new ProviderFinancialReportResponse.HistoryEntry(
                        claim.getId(),
                        claim.getFoodListing().getTitle(),
                        offerType(claim),
                        claim.getClaimedServings(),
                        rescuedKilograms(claim),
                        claim.getTotalPrice() == null ? 0.0 : claim.getTotalPrice(),
                        claim.getUpdatedAt()
                ))
                .toList();
        return new ProviderFinancialReportResponse(
                new ProviderImpactReportResponse(
                        completedClaims.size(), servings, rescuedKg, donations, sales, revenue),
                history
        );
    }

    private static double rescuedKilograms(FoodClaim claim) {
        return claim.getFoodListing().getQuantityKg()
                * claim.getClaimedServings()
                / claim.getFoodListing().getServingsEquivalent();
    }

    private static OfferType offerType(FoodClaim claim) {
        return claim.getFoodListing().getOfferType() == null
                ? OfferType.DONATION
                : claim.getFoodListing().getOfferType();
    }
}
