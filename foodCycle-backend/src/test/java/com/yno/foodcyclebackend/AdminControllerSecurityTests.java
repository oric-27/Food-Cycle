package com.yno.foodcyclebackend;

import com.yno.foodcyclebackend.controller.AdminController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testAdminEndpointWithoutAuthReturns401() throws Exception {
        mockMvc.perform(post("/api/admin/users/1/approve"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "VOLUNTEER")
    void testAdminEndpointWithVolunteerReturns403() throws Exception {
        mockMvc.perform(post("/api/admin/users/1/approve"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "FOOD_PROVIDER")
    void testAdminEndpointWithFoodProviderReturns403() throws Exception {
        mockMvc.perform(post("/api/admin/users/1/approve"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ORGANIZATION")
    void testAdminEndpointWithOrganizationReturns403() throws Exception {
        mockMvc.perform(post("/api/admin/users/1/approve"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testAdminEndpointWithAdminReturns200() throws Exception {
        mockMvc.perform(post("/api/admin/users/1/approve"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testGetAllUsersEndpointWithAdminReturns200() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(authorities = "VOLUNTEER")
    void testGetAllUsersEndpointWithVolunteerReturns403() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testAssignRoleEndpointWithAdminReturns200() throws Exception {
        mockMvc.perform(post("/api/admin/users/1/assign-role")
                        .contentType("application/json")
                        .content("{\"role\":\"FOOD_PROVIDER\"}"))
                .andExpect(status().isOk());
    }
}
