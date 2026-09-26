package com.yno.foodcyclebackend.dto.response;

public record ProviderImpactReportResponse(
        long completedOrders,
        long rescuedServings,
        double rescuedFoodKg,
        long donationOrders,
        long discountedSaleOrders,
        double salesRevenue
) {
}
