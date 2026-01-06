package com.pokework.controller;

import com.pokework.dto.DashboardResponse;
import com.pokework.model.Pokemon;
import com.pokework.model.User;
import com.pokework.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    private final UserRepository userRepository;

    public DashboardController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        // Get the authenticated user's username from SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pokemon p = user.getPokemon(); // Assumes OneToOne mapping exists
        if (p == null) {
            // Fallback if pokemon is missing
            return ResponseEntity
                    .ok(new DashboardResponse(user.getUsername(), "Unknown", 1, 0, 0, "Egg", user.getRole(),
                            user.getStatus(), user.getProfilePictureUrl()));
        }

        DashboardResponse response = new DashboardResponse(
                user.getUsername(),
                p.getName(),
                p.getLevel(),
                p.getCurrentXp(),
                p.getTotalXp(),
                p.getEvolutionStage(),
                user.getRole(),
                user.getStatus(),
                user.getProfilePictureUrl());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/status")
    public ResponseEntity<Map<String, String>> updateStatus(
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> statusData) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Updating status for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newStatus = statusData.get("status");
        if (newStatus == null) {
            logger.error("Status value missing in request for user: {}", username);
            return ResponseEntity.badRequest().build();
        }

        user.setStatus(newStatus);
        userRepository.save(user);
        logger.info("Status updated to '{}' for user: {}", newStatus, username);

        return ResponseEntity.ok(Map.of("status", user.getStatus()));
    }

    @PutMapping("/profile")
    @SuppressWarnings("null")
    public ResponseEntity<DashboardResponse> updateProfile(
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> profileData) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Updating profile for user: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileData.containsKey("username")) {
            user.setUsername(profileData.get("username"));
            logger.info("Username changed to '{}' for user: {}", profileData.get("username"), username);
        }
        if (profileData.containsKey("profilePictureUrl")) {
            user.setProfilePictureUrl(profileData.get("profilePictureUrl"));
            logger.info("Profile picture URL updated for user: {}", username);
        }

        userRepository.save(user);
        return getDashboard();
    }
}
