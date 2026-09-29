package com.yno.foodcyclebackend.config;

import com.yno.foodcyclebackend.dao.RoleDao;
import com.yno.foodcyclebackend.dao.UserDao;
import com.yno.foodcyclebackend.entity.Role;
import com.yno.foodcyclebackend.entity.User;
import com.yno.foodcyclebackend.enums.RoleName;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleDao roleDao;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public void createRole(RoleName name) {
        if (roleDao.findByRoleName(name).isEmpty()) {
            Role role = new Role();
            role.setRoleName(name);
            roleDao.save(role);
        }
    }

    public void createAdminUser() {
        if (userDao.findByEmail("admin@foodcycle.com").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@foodcycle.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setVerificationStatus(VerificationStatus.VERIFIED);
            admin.setIsActive(true);

            Role adminRole = roleDao.findByRoleName(RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
            admin.setRoles(new HashSet<>());
            admin.getRoles().add(adminRole);

            userDao.save(admin);
        }
    }

    @Override
    public void run(String... args) throws Exception {
        createRole(RoleName.FOOD_PROVIDER);
        createRole(RoleName.ORGANIZATION);
        createRole(RoleName.ADMIN);
        createRole(RoleName.VOLUNTEER);
        createAdminUser();
    }
}
