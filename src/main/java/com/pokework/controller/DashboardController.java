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

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

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
    public ResponseEntity<java.util.Map<String, String>> updateStatus(
            @org.springframework.web.bind.annotation.RequestBody String status) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(status.replace("\"", ""));
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Map.of("status", user.getStatus()));
    }

    @PutMapping("/profile")
    @SuppressWarnings("null")
    public ResponseEntity<DashboardResponse> updateProfile(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> profileData) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileData.containsKey("username")) {
            user.setUsername(profileData.get("username"));
        }
        if (profileData.containsKey("profilePictureUrl")) {
            user.setProfilePictureUrl(profileData.get("profilePictureUrl"));
        }

        userRepository.save(user);
        return getDashboard();
    }
}
