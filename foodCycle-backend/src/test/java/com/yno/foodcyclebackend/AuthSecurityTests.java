package com.yno.foodcyclebackend;

import com.yno.foodcyclebackend.dao.RoleDao;
import com.yno.foodcyclebackend.dao.UserDao;
import com.yno.foodcyclebackend.dao.VolunteerDao;
import com.yno.foodcyclebackend.dto.request.RegisterRequest;
import com.yno.foodcyclebackend.entity.Role;
import com.yno.foodcyclebackend.entity.User;
import com.yno.foodcyclebackend.enums.RoleName;
import com.yno.foodcyclebackend.enums.VerificationStatus;
import com.yno.foodcyclebackend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthSecurityTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private VolunteerDao volunteerDao;

    @BeforeEach
    void setup() {
        // Ensure VOLUNTEER role exists
        if (roleDao.findByRoleName(RoleName.VOLUNTEER).isEmpty()) {
            Role volunteerRole = new Role();
            volunteerRole.setRoleName(RoleName.VOLUNTEER);
            roleDao.save(volunteerRole);
        }
    }

    @Test
    void testPublicRegistrationAssignsVolunteerRole() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        authService.register(request);

        User user = userDao.findByEmail("test@example.com")
                .orElseThrow(() -> new AssertionError("User should be created"));

        assertEquals(1, user.getRoles().size());
        assertEquals(RoleName.VOLUNTEER, user.getRoles().iterator().next().getRoleName());
        assertEquals(VerificationStatus.PENDING, user.getVerificationStatus());
    }

    @Test
    void testPublicRegistrationCreatesVolunteerProfile() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser2");
        request.setEmail("test2@example.com");
        request.setPassword("password123");

        authService.register(request);

        User user = userDao.findByEmail("test2@example.com")
                .orElseThrow(() -> new AssertionError("User should be created"));

        assertNotNull(volunteerDao.findByUser(user).orElse(null),
                "Volunteer profile should be created for default role");
    }

    @Test
    void testRegisterRequestDoesNotAcceptRoleName() {
        RegisterRequest request = new RegisterRequest();
        
        // Verify RegisterRequest class does not have roleName field
        try {
            request.getClass().getMethod("getRoleName");
            fail("RegisterRequest should not have getRoleName method");
        } catch (NoSuchMethodException e) {
            // Expected - roleName field should not exist
        }
    }

    @Test
    void testDuplicateEmailRegistration() {
        RegisterRequest request1 = new RegisterRequest();
        request1.setUsername("user1");
        request1.setEmail("duplicate@example.com");
        request1.setPassword("password123");

        authService.register(request1);

        RegisterRequest request2 = new RegisterRequest();
        request2.setUsername("user2");
        request2.setEmail("duplicate@example.com");
        request2.setPassword("password456");

        assertThrows(org.springframework.security.core.userdetails.UsernameNotFoundException.class,
                () -> authService.register(request2),
                "Should throw exception for duplicate email");
    }
}
