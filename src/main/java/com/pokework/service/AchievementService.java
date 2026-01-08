package com.pokework.service;

import com.pokework.dto.AchievementResponse;
import com.pokework.model.User;
import com.pokework.model.WorkSession;
import com.pokework.model.Quest;
import com.pokework.repository.UserRepository;
import com.pokework.repository.QuestRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AchievementService {

    private final UserRepository userRepository;
    private final QuestRepository questRepository;

    public AchievementService(UserRepository userRepository, QuestRepository questRepository) {
        this.userRepository = userRepository;
        this.questRepository = questRepository;
    }

    public AchievementResponse getMyAchievements() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WorkSession> sessions = user.getWorkSessions();
        if (sessions == null)
            sessions = new ArrayList<>();

        List<Quest> quests = questRepository.findByUser(user);
        long completedQuests = quests.stream().filter(Quest::isCompleted).count();

        List<AchievementResponse.Badge> badges = new ArrayList<>();

        // 1. First Steps (1 session)
        boolean firstSteps = !sessions.isEmpty();
        badges.add(new AchievementResponse.Badge(1, "First Steps", "Log your first work session", "👟", firstSteps,
                firstSteps ? 1 : 0, 1));

        // 2. Early Bird (Before 8 AM)
        boolean earlyBird = sessions.stream()
                .anyMatch(s -> s.getStartTime() != null && s.getStartTime().isBefore(LocalTime.of(8, 0)));
        badges.add(new AchievementResponse.Badge(2, "Early Bird", "Start working before 8 AM", "🌅", earlyBird,
                earlyBird ? 1 : 0, 1));

        // 3. Night Owl (After 10 PM)
        boolean nightOwl = sessions.stream()
                .anyMatch(s -> s.getStartTime() != null && s.getStartTime().isAfter(LocalTime.of(22, 0)));
        badges.add(new AchievementResponse.Badge(3, "Night Owl", "Work late at night (past 10 PM)", "🦉", nightOwl,
                nightOwl ? 1 : 0, 1));

        // 4. Marathon Runner (8 hours in one day)
        Map<LocalDate, Double> dailyHours = sessions.stream().collect(Collectors.groupingBy(
                WorkSession::getWorkDate, Collectors.summingDouble(WorkSession::getHours)));
        double maxDailyHours = dailyHours.values().stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
        badges.add(new AchievementResponse.Badge(4, "Marathon Runner", "Work 8 hours in one day", "🏃",
                maxDailyHours >= 8.0, Math.min(maxDailyHours, 8.0), 8.0));

        // 5. XP Specialist (500 total XP)
        double totalXp = user.getPokemon() != null ? user.getPokemon().getTotalXp() : 0;
        badges.add(new AchievementResponse.Badge(5, "XP Specialist", "Earn 500 total XP", "💎", totalXp >= 500,
                Math.min(totalXp, 500), 500));

        // 6. Level Up! (Reach Level 10)
        int level = user.getPokemon() != null ? user.getPokemon().getLevel() : 1;
        badges.add(new AchievementResponse.Badge(6, "Level Up!", "Reach Level 10", "⭐", level >= 10,
                Math.min(level, 10), 10));

        // 7. Apprentice (Complete 5 quests)
        badges.add(new AchievementResponse.Badge(7, "Apprentice", "Complete 5 adventurous quests", "⚔️",
                completedQuests >= 5, Math.min(completedQuests, 5), 5));

        // 8. Journeyman (Complete 15 quests)
        badges.add(new AchievementResponse.Badge(8, "Journeyman", "Complete 15 adventurous quests", "🛡️",
                completedQuests >= 15, Math.min(completedQuests, 15), 15));

        // 9. Master Strategist (Complete 30 quests)
        badges.add(new AchievementResponse.Badge(9, "Master Strategist", "Complete 30 adventurous quests", "🏰",
                completedQuests >= 30, Math.min(completedQuests, 30), 30));

        // 10. Weekend Warrior (Work on Sat/Sun)
        boolean weekend = sessions.stream().anyMatch(s -> {
            DayOfWeek dow = s.getWorkDate().getDayOfWeek();
            return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
        });
        badges.add(new AchievementResponse.Badge(10, "Weekend Warrior", "Log work on a Saturday or Sunday", "🎮",
                weekend, weekend ? 1 : 0, 1));

        // 11. Power Hour (A session >= 3 hours)
        double maxSession = sessions.stream().mapToDouble(WorkSession::getHours).max().orElse(0.0);
        badges.add(new AchievementResponse.Badge(11, "Power Hour", "Log a single session of 3+ hours", "⚡",
                maxSession >= 3.0, Math.min(maxSession, 3.0), 3.0));

        // 12. Workhorse (Logged 10 sessions total)
        badges.add(new AchievementResponse.Badge(12, "Workhorse", "Log 10 total work sessions", "🐴",
                sessions.size() >= 10, Math.min(sessions.size(), 10), 10));

        // 13. Centurion (Earn 1000 Total XP)
        badges.add(new AchievementResponse.Badge(13, "Centurion", "Accumulate 1000 total XP", "💯", totalXp >= 1000,
                Math.min(totalXp, 1000), 1000));

        // 14. Elite Trainer (Reach Level 20)
        badges.add(new AchievementResponse.Badge(14, "Elite Trainer", "Reach Level 20", "🔥", level >= 20,
                Math.min(level, 20), 20));

        // 15. Daily Grind (3 sessions on same day)
        long maxDailySessions = sessions.stream()
                .collect(Collectors.groupingBy(WorkSession::getWorkDate,
                        Collectors.counting()))
                .values().stream().mapToLong(Long::longValue).max().orElse(0L);
        badges.add(new AchievementResponse.Badge(15, "Daily Grind", "Log 3 separate sessions in one day", "☕",
                maxDailySessions >= 3, Math.min(maxDailySessions, 3), 3));

        int unlockedCount = (int) badges.stream().filter(AchievementResponse.Badge::isUnlocked).count();
        return new AchievementResponse(badges, unlockedCount);
    }
}
