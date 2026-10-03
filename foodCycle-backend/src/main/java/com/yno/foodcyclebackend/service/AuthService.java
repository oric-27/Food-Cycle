package com.yno.foodcyclebackend.service;

import com.yno.foodcyclebackend.dao.*;
import com.yno.foodcyclebackend.dto.request.LoginRequest;
import com.yno.foodcyclebackend.dto.request.RegisterRequest;
import com.yno.foodcyclebackend.dto.response.LoginResponse;
import com.yno.foodcyclebackend.entity.*;
import com.yno.foodcyclebackend.enums.ProviderType;
import com.yno.foodcyclebackend.enums.RoleName;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.foodProvider.dao.FoodProviderDao;
import com.yno.foodcyclebackend.organization.dao.OrganizationDao;
import com.yno.foodcyclebackend.organization.entity.Organization;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserDao userDao;
    private final RoleDao roleDao;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final FoodProviderDao foodProviderDao;
    private final OrganizationDao organizationDao;
    private final VolunteerDao volunteerDao;
    private final JwtService jwtService;

    @Transactional
    public void register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userDao.existsByEmail(email)) {
            throw  new UsernameNotFoundException("Error: Email is already in use!");
        }

        RoleName roleName;
        try {
            roleName = RoleName.valueOf(request.getRoleName().trim().toUpperCase(Locale.ROOT).replace(' ', '_'));
        } catch (IllegalArgumentException exception) {
            throw new AccessDeniedException("This registration role is not allowed");
        }
        if (roleName == RoleName.ADMIN) {
            throw new AccessDeniedException("This registration role is not allowed");
        }
        if (roleName == RoleName.ORGANIZATION) {
            requireOrganizationField(request.getOrganizationName(), "Organization name");
            requireOrganizationField(request.getAddress(), "Organization address");
            requireOrganizationField(request.getContactNumber(), "Organization contact number");
            requireOrganizationField(request.getRegistrationNumber(), "Registration number");
            requireOrganizationField(request.getLicenseDocumentUrl(), "License document URL");
            if (request.getDailyCapacityServings() == null || request.getDailyCapacityServings() <= 0) {
                throw new ResponseStatusException(BAD_REQUEST, "Daily capacity must be greater than zero");
            }
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername().trim());
        user.setVerificationStatus(VerificationStatus.PENDING);
        Set<Role> roles = new HashSet<>();
        Role userRole = roleDao.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found!"));
        roles.add(userRole);
        user.setRoles(roles);

        User saveUser =  userDao.save(user);

        if (roleName == RoleName.FOOD_PROVIDER){
            FoodProvider provider = new FoodProvider();
            provider.setUser(saveUser);
            provider.setProviderType(
                    request.getProviderType() == null ? ProviderType.OTHER : request.getProviderType()
            );
            provider.setAddress(request.getAddress());
            provider.setBusinessName(request.getBusinessName() == null
                    ? user.getUsername()
                    : request.getBusinessName().trim());
            provider.setContactNumber(request.getContactNumber());
            provider.setLicenseDocumentUrl(request.getLicenseDocumentUrl());
            provider.setRegistrationNumber(request.getRegistrationNumber());
            foodProviderDao.save(provider);
        }else if (roleName == RoleName.ORGANIZATION) {
            Organization organization = new Organization();
            organization.setUser(saveUser);
            organization.setAddress(request.getAddress().trim());
            organization.setOrganizationName(request.getOrganizationName().trim());
            organization.setContactNumber(request.getContactNumber().trim());
            organization.setRegistrationNumber(request.getRegistrationNumber().trim());
            organization.setLicenseDocumentUrl(request.getLicenseDocumentUrl().trim());
            int capacity = request.getDailyCapacityServings();
            organization.setDailyCapacityServings(capacity);
            organization.setRemainingCapacityServings(capacity);
            organization.setCapacityResetDate(LocalDate.now(ZoneId.of("Asia/Yangon")));
            organizationDao.save(organization);
        }else  if (roleName == RoleName.VOLUNTEER) {
            Volunteer volunteer = new Volunteer();
            volunteer.setUser(saveUser);
            volunteer.setIsAvailable(request.getIsAvailable() == null || request.getIsAvailable());
            volunteerDao.save(volunteer);
        }
    }

    private void requireOrganizationField(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, fieldName + " is required");
        }
    }

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = userDao.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Error: User is not found!"));

        String token = jwtService.generateToken(user);

        return new LoginResponse(token, "Bearer", user.getEmail(), user.getUsername(), user.getRoles()
                .stream()
                .map(role -> role.getRoleName().name())
                .toList());

    }


}
