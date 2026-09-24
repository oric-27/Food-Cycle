package com.yno.foodcyclebackend.config;

import com.yno.foodcyclebackend.dao.RoleDao;
import com.yno.foodcyclebackend.entity.Role;
import com.yno.foodcyclebackend.enums.RoleName;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleDao roleDao;

    public void createRole(RoleName name) {
        if (roleDao.findByRoleName(name).isEmpty()) {
            Role role = new Role();
            role.setRoleName(name);
            roleDao.save(role);
        }
    }

    @Override
    public void run(String... args) throws Exception {
        createRole(RoleName.FOOD_PROVIDER);
        createRole(RoleName.ORGANIZATION);
        createRole(RoleName.ADMIN);
        createRole(RoleName.VOLUNTEER);
    }
}
