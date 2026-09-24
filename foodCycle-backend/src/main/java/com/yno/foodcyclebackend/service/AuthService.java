package com.yno.foodcyclebackend.service;

import com.yno.foodcyclebackend.dao.*;
import com.yno.foodcyclebackend.dto.request.LoginRequest;
import com.yno.foodcyclebackend.dto.request.RegisterRequest;
import com.yno.foodcyclebackend.entity.*;
import com.yno.foodcyclebackend.enums.ProviderType;
import com.yno.foodcyclebackend.enums.RoleName;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Map;
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

    @Transactional
    public void register(RegisterRequest request) {
        if (userDao.existsByEmail(request.getEmail())) {
            throw  new UsernameNotFoundException("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setVerificationStatus(VerificationStatus.PENDING);
        Set<Role> roles = new HashSet<>();
        Role userRole = roleDao.findByRoleName(RoleName.valueOf(request.getRoleName()))
                .orElseThrow(() -> new RuntimeException("Error: Role is not found!"));
        roles.add(userRole);
        user.setRoles(roles);

        User saveUser =  userDao.save(user);

        if (RoleName.valueOf(request.getRoleName()) == RoleName.FOOD_PROVIDER){
            FoodProvider provider = new FoodProvider();
            provider.setUser(saveUser);
            provider.setProviderType(ProviderType.RESTAURANT);
            foodProviderDao.save(provider);
        }else if (RoleName.valueOf(request.getRoleName()) == RoleName.ORGANIZATION) {
            Organization organization = new Organization();
            organization.setUser(saveUser);
            organization.setDailyCapacityServings(0);
            organization.setRemainingCapacityServings(0);
            organizationDao.save(organization);
        }else  if (RoleName.valueOf(request.getRoleName()) == RoleName.VOLUNTEER) {
            Volunteer volunteer = new Volunteer();
            volunteer.setUser(saveUser);
            volunteerDao.save(volunteer);
        }
    }

    public void login(LoginRequest request) {
        var auth = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        var authentication = authenticationManager.authenticate(auth);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }


}
