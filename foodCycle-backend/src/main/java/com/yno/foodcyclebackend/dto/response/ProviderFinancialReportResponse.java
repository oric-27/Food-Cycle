package com.yno.foodcyclebackend.dto.response;

import com.yno.foodcyclebackend.enums.OfferType;

import java.time.LocalDateTime;
import java.util.List;

public record ProviderFinancialReportResponse(
        ProviderImpactReportResponse impact,
        List<HistoryEntry> history
) {
    public record HistoryEntry(
            Long claimId,
            String listingTitle,
            OfferType offerType,
            Integer servings,
            Double rescuedFoodKg,
            Double totalPrice,
            LocalDateTime completedAt
    ) {
    }
}
