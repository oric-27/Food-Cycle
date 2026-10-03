package com.yno.foodcyclebackend;

import com.yno.foodcyclebackend.dao.RoleDao;
import com.yno.foodcyclebackend.dao.UserDao;
import com.yno.foodcyclebackend.dao.VolunteerDao;
import com.yno.foodcyclebackend.dto.request.RegisterRequest;
import com.yno.foodcyclebackend.entity.Role;
import com.yno.foodcyclebackend.entity.User;
import com.yno.foodcyclebackend.enums.RoleName;
import com.yno.foodcyclebackend.foodProvider.dao.FoodProviderDao;
import com.yno.foodcyclebackend.organization.dao.OrganizationDao;
import com.yno.foodcyclebackend.organization.entity.Organization;
import com.yno.foodcyclebackend.service.AuthService;
import com.yno.foodcyclebackend.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class OrganizationRegistrationTests {
    private final UserDao userDao = mock(UserDao.class);
    private final RoleDao roleDao = mock(RoleDao.class);
    private final OrganizationDao organizationDao = mock(OrganizationDao.class);
    private final AuthService authService = new AuthService(
            userDao,
            roleDao,
            mock(PasswordEncoder.class),
            mock(AuthenticationManager.class),
            mock(FoodProviderDao.class),
            organizationDao,
            mock(VolunteerDao.class),
            mock(JwtService.class));

    @Test
    void registrationPersistsAllRequiredOrganizationDetails() {
        Role role = new Role();
        role.setRoleName(RoleName.ORGANIZATION);
        when(userDao.existsByEmail("org@example.com")).thenReturn(false);
        when(roleDao.findByRoleName(RoleName.ORGANIZATION)).thenReturn(Optional.of(role));
        when(userDao.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.register(validOrganizationRequest());

        var organizationCaptor = org.mockito.ArgumentCaptor.forClass(Organization.class);
        verify(organizationDao).save(organizationCaptor.capture());
        Organization organization = organizationCaptor.getValue();
        assertEquals("Community Kitchen", organization.getOrganizationName());
        assertEquals("0912345678", organization.getContactNumber());
        assertEquals("REG-42", organization.getRegistrationNumber());
        assertEquals("https://files.example.org/license.pdf", organization.getLicenseDocumentUrl());
        assertEquals(30, organization.getDailyCapacityServings());
        assertEquals(30, organization.getRemainingCapacityServings());
    }

    @Test
    void registrationRejectsIncompleteOrganizationDetailsBeforeCreatingAccount() {
        when(userDao.existsByEmail("org@example.com")).thenReturn(false);
        when(roleDao.findByRoleName(RoleName.ORGANIZATION)).thenReturn(Optional.of(new Role()));
        RegisterRequest request = validOrganizationRequest();
        request.setLicenseDocumentUrl(" ");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(request));

        assertEquals(400, exception.getStatusCode().value());
        verify(userDao, never()).save(any(User.class));
        verify(organizationDao, never()).save(any(Organization.class));
    }

    private RegisterRequest validOrganizationRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("community");
        request.setEmail("org@example.com");
        request.setPassword("safe-password");
        request.setRoleName("ORGANIZATION");
        request.setOrganizationName("Community Kitchen");
        request.setAddress("Yangon");
        request.setContactNumber("0912345678");
        request.setRegistrationNumber("REG-42");
        request.setLicenseDocumentUrl("https://files.example.org/license.pdf");
        request.setDailyCapacityServings(30);
        return request;
    }
}
