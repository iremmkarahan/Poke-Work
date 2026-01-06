package com.pokework;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokework.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PokeWorkApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.pokework.repository.PokemonRepository pokemonRepository;
    @Autowired
    private com.pokework.repository.QuestRepository questRepository;
    @Autowired
    private com.pokework.repository.WorkSessionRepository workSessionRepository;

    @BeforeEach
    void setUp() {
        questRepository.deleteAll();
        workSessionRepository.deleteAll();
        pokemonRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void contextLoads() {
    }

    private void registerTestUser() throws Exception {
        Map<String, String> regRequest = Map.of(
                "username", "testuser",
                "password", "Password123!",
                "role", "USER");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void testRegistrationAndLogin() throws Exception {
        // 1. Register a user (Success)
        Map<String, String> regRequest = Map.of(
                "username", "testuser",
                "password", "Password123!",
                "role", "USER");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("testuser")));

        // 2. Register with short password (Fail)
        Map<String, String> shortPwRequest = Map.of(
                "username", "testuser2",
                "password", "123",
                "role", "USER");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(shortPwRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("at least 8 characters")));

        // 3. Login
        Map<String, String> loginRequest = Map.of(
                "username", "testuser",
                "password", "Password123!");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("testuser")));
    }

    @Test
    @WithMockUser(username = "testuser")
    void testDashboardFeatures() throws Exception {
        registerTestUser();

        // 1. Get Dashboard
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trainerName", is("testuser")))
                .andExpect(jsonPath("$.status", is("Ready to Work")));

        // 2. Update Status
        Map<String, String> statusUpdate = Map.of("status", "Focusing");
        mockMvc.perform(put("/api/dashboard/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("Focusing")));

        // 3. Update Profile (Keep username same to avoid session issues in test)
        Map<String, String> profileUpdate = Map.of(
                "username", "testuser",
                "profilePictureUrl", "http://example.com/pic.png");
        mockMvc.perform(put("/api/dashboard/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profileUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profilePictureUrl", is("http://example.com/pic.png")));
    }

    @Test
    @WithMockUser(username = "testuser")
    void testQuestManagement() throws Exception {
        registerTestUser();

        // 1. Create Quest
        Map<String, Object> questRequest = Map.of(
                "title", "Kill 10 Rats",
                "difficulty", "Easy");

        mockMvc.perform(post("/api/quests")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(questRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Kill 10 Rats")));

        // 2. List Quests
        mockMvc.perform(get("/api/quests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Kill 10 Rats")));
    }
}
