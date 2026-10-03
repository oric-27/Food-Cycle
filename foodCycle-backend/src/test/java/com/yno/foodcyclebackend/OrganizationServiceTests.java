package com.yno.foodcyclebackend;

import com.yno.foodcyclebackend.entity.User;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.organization.dao.OrganizationDao;
import com.yno.foodcyclebackend.organization.entity.Organization;
import com.yno.foodcyclebackend.organization.service.OrganizationService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OrganizationServiceTests {
    private final OrganizationDao organizationDao = mock(OrganizationDao.class);
    private final OrganizationService organizationService = new OrganizationService(organizationDao);

    @Test
    void getProfileLoadsTheSignedInOrganizationsPersistedDetails() {
        User user = new User();
        user.setVerificationStatus(VerificationStatus.VERIFIED);
        user.setIsActive(true);
        Organization organization = new Organization();
        organization.setUser(user);
        organization.setOrganizationName("Community Kitchen");
        organization.setAddress("Yangon");
        organization.setContactNumber("0912345678");
        organization.setDailyCapacityServings(40);
        organization.setRemainingCapacityServings(25);
        organization.setCapacityResetDate(LocalDate.now(ZoneId.of("Asia/Yangon")));
        when(organizationDao.findByUserEmailForUpdate("org@example.com"))
                .thenReturn(Optional.of(organization));
        when(organizationDao.save(organization)).thenReturn(organization);

        var response = organizationService.getProfile(
                new UsernamePasswordAuthenticationToken("org@example.com", "password"));

        assertEquals("Community Kitchen", response.organizationName());
        assertEquals("0912345678", response.contentNumber());
        assertEquals(25, response.remainingCapacityServings());
        verify(organizationDao).findByUserEmailForUpdate("org@example.com");
    }

    @Test
    void reserveCapacityDecrementsAvailableServingsAndRejectsOverCapacity() {
        Organization organization = new Organization();
        organization.setDailyCapacityServings(20);
        organization.setRemainingCapacityServings(5);

        organizationService.reserveCapacity(organization, 3);

        assertEquals(2, organization.getRemainingCapacityServings());
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> organizationService.reserveCapacity(organization, 3));
        assertEquals(400, exception.getStatusCode().value());
        assertEquals(2, organization.getRemainingCapacityServings());
    }

    @Test
    void releaseCapacityRestoresOnlyCurrentDayReservationsWithoutExceedingDailyLimit() {
        Organization organization = new Organization();
        organization.setDailyCapacityServings(20);
        organization.setRemainingCapacityServings(18);
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Yangon"));

        organizationService.releaseCapacity(organization, 5, today);
        assertEquals(20, organization.getRemainingCapacityServings());

        organization.setRemainingCapacityServings(10);
        organizationService.releaseCapacity(organization, 5, today.minusDays(1));
        assertEquals(10, organization.getRemainingCapacityServings());
    }
}
