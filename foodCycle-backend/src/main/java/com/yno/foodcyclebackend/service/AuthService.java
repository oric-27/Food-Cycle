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

import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

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
            organization.setAddress(request.getAddress());
            int capacity = request.getDailyCapacityServings() == null ?
                            0 :
                            Integer.parseInt(request.getDailyCapacityServings());
            organization.setDailyCapacityServings(capacity);
            organization.setRemainingCapacityServings(capacity);
            organizationDao.save(organization);
        }else  if (roleName == RoleName.VOLUNTEER) {
            Volunteer volunteer = new Volunteer();
            volunteer.setUser(saveUser);
            volunteer.setIsAvailable(request.getIsAvailable() == null || request.getIsAvailable());
            volunteerDao.save(volunteer);
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

        return new LoginResponse(token, "Bearer", user.getEmail(), user.getRoles()
                .stream()
                .map(role -> role.getRoleName().name())
                .toList());

    }


}
