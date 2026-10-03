package com.yno.foodcyclebackend;

import com.yno.foodcyclebackend.dao.FoodClaimDao;
import com.yno.foodcyclebackend.dao.FoodListingDao;
import com.yno.foodcyclebackend.dto.request.CreateFoodClaimRequest;
import com.yno.foodcyclebackend.entity.FoodListing;
import com.yno.foodcyclebackend.enums.ListingStatus;
import com.yno.foodcyclebackend.enums.OfferType;
import com.yno.foodcyclebackend.organization.dao.OrganizationDao;
import com.yno.foodcyclebackend.organization.entity.Organization;
import com.yno.foodcyclebackend.organization.service.FoodClaimService;
import com.yno.foodcyclebackend.organization.service.OrganizationService;
import com.yno.foodcyclebackend.foodProvider.service.FoodProviderService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FoodClaimCapacityTests {
    private final FoodClaimDao foodClaimDao = mock(FoodClaimDao.class);
    private final FoodListingDao foodListingDao = mock(FoodListingDao.class);
    private final OrganizationDao organizationDao = mock(OrganizationDao.class);
    private final OrganizationService organizationService = mock(OrganizationService.class);
    private final FoodProviderService foodProviderService = mock(FoodProviderService.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final FoodClaimService foodClaimService = new FoodClaimService(
            foodClaimDao,
            foodListingDao,
            organizationDao,
            organizationService,
            foodProviderService,
            passwordEncoder);

    @Test
    void createClaimReservesRequestedServingsBeforeSavingClaim() {
        Organization organization = new Organization();
        FoodListing listing = availableListing();
        when(organizationService.getVerifiedOrganizationForClaim(any())).thenReturn(organization);
        when(foodListingDao.findByIdForUpdate(7L)).thenReturn(Optional.of(listing));
        when(passwordEncoder.encode(any())).thenReturn("hashed-otp");
        when(foodClaimDao.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        CreateFoodClaimRequest request = claimRequest(6);

        var response = foodClaimService.createClaim(request,
                new UsernamePasswordAuthenticationToken("org@example.com", "password"));

        assertEquals(7L, response.listingId());
        assertEquals("Surplus meals", response.listingTitle());
        verify(organizationService).reserveCapacity(organization, 6);
        verify(organizationDao).save(organization);
        assertEquals(ListingStatus.RESERVED, listing.getStatus());
    }

    @Test
    void createClaimDoesNotReserveListingWhenOrganizationCapacityIsInsufficient() {
        Organization organization = new Organization();
        FoodListing listing = availableListing();
        when(organizationService.getVerifiedOrganizationForClaim(any())).thenReturn(organization);
        when(foodListingDao.findByIdForUpdate(7L)).thenReturn(Optional.of(listing));
        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST))
                .when(organizationService).reserveCapacity(organization, 6);

        assertThrows(ResponseStatusException.class, () -> foodClaimService.createClaim(
                claimRequest(6),
                new UsernamePasswordAuthenticationToken("org@example.com", "password")));

        verify(foodClaimDao, never()).save(any());
        verify(organizationDao, never()).save(any());
        assertEquals(ListingStatus.AVAILABLE, listing.getStatus());
    }

    private FoodListing availableListing() {
        FoodListing listing = new FoodListing();
        listing.setTitle("Surplus meals");
        listing.setServingsEquivalent(10);
        listing.setOfferType(OfferType.DONATION);
        listing.setStatus(ListingStatus.AVAILABLE);
        listing.setExpiryTime(LocalDateTime.now().plusHours(4));
        listing.setPickupDeadline(LocalDateTime.now().plusHours(3));
        listing.setId(7L);
        return listing;
    }

    private CreateFoodClaimRequest claimRequest(int servings) {
        CreateFoodClaimRequest request = new CreateFoodClaimRequest();
        request.setListingId(7L);
        request.setClaimedServings(servings);
        return request;
    }
}
