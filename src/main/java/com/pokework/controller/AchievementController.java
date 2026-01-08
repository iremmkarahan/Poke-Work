package com.pokework.controller;

import com.pokework.dto.AchievementResponse;
import com.pokework.service.AchievementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping
    public ResponseEntity<AchievementResponse> getAchievements() {
        return ResponseEntity.ok(achievementService.getMyAchievements());
    }
}
