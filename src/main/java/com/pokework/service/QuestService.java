package com.pokework.service;

import com.pokework.model.Quest;
import com.pokework.model.User;
import com.pokework.model.WorkSession;
import com.pokework.model.Pokemon;
import com.pokework.repository.QuestRepository;
import com.pokework.repository.UserRepository;
import com.pokework.repository.WorkSessionRepository;
import com.pokework.repository.PokemonRepository;
import com.pokework.repository.GoalRepository;
import com.pokework.model.Goal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestService {
    private final QuestRepository questRepository;
    private final UserRepository userRepository;
    private final WorkSessionRepository workSessionRepository;
    private final PokemonRepository pokemonRepository;

    private final GoalRepository goalRepository;

    public QuestService(QuestRepository questRepository, UserRepository userRepository,
            WorkSessionRepository workSessionRepository, PokemonRepository pokemonRepository,
            GoalRepository goalRepository) {
        this.questRepository = questRepository;
        this.userRepository = userRepository;
        this.workSessionRepository = workSessionRepository;
        this.pokemonRepository = pokemonRepository;
        this.goalRepository = goalRepository;
    }

    public List<Quest> getMyQuests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return questRepository.findByUser(user);
    }

    @Transactional
    public Quest createQuest(Quest quest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        quest.setUser(user);

        if (quest.getGoal() != null && quest.getGoal().getId() != null) {
            Goal goal = goalRepository.findById(quest.getGoal().getId())
                    .orElseThrow(() -> new RuntimeException("Goal not found"));
            if (!goal.getUser().getUsername().equals(username)) {
                throw new RuntimeException("Unauthorized goal");
            }
            quest.setGoal(goal);
        } else {
            quest.setGoal(null); // Ensure it's null if no ID provided
        }

        return questRepository.save(quest);
    }

    @Transactional
    public Quest finishQuest(Long questId, double hours) {
        if (questId == null)
            throw new IllegalArgumentException("Quest ID cannot be null");
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!quest.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        if (quest.isCompleted()) {
            throw new RuntimeException("Quest already completed");
        }

        // 1. Calculate XP (Minimum 1 XP if hours > 0)
        int earnedXp = (int) (hours * 10);
        if (earnedXp == 0 && hours > 0)
            earnedXp = 1;

        quest.setEarnedXp(earnedXp);
        quest.setCompleted(true);

        // 2. Log Work Session
        User user = quest.getUser();
        java.time.LocalTime startTime = java.time.LocalTime.now().minusMinutes((long) (hours * 60));
        WorkSession session = new WorkSession(user, java.time.LocalDate.now(), hours, startTime);
        workSessionRepository.save(session);

        // 3. Add XP to Pokemon (with safety check)
        Pokemon p = user.getPokemon();
        if (p != null) {
            p.setCurrentXp(p.getCurrentXp() + earnedXp);
            p.setTotalXp(p.getTotalXp() + earnedXp);

            while (p.getCurrentXp() >= 100) {
                p.setCurrentXp(p.getCurrentXp() - 100);
                p.setLevel(p.getLevel() + 1);
            }
            pokemonRepository.save(p);
        }

        // 4. Goal Integration: Update progress
        Goal associatedGoal = quest.getGoal();
        if (associatedGoal != null) {
            if ("hours".equalsIgnoreCase(associatedGoal.getUnit())) {
                associatedGoal.setCurrentValue(associatedGoal.getCurrentValue() + hours);
            } else if ("XP".equalsIgnoreCase(associatedGoal.getUnit())) {
                associatedGoal.setCurrentValue(associatedGoal.getCurrentValue() + earnedXp);
            } else {
                // Default: increment by 1 (e.g. for "tasks", "percent" might need more logic
                // but 1 is a safe increment)
                associatedGoal.setCurrentValue(associatedGoal.getCurrentValue() + 1);
            }
            goalRepository.save(associatedGoal);
        } else {
            // Fallback: Update all goals tracking 'hours' (legacy behavior)
            List<Goal> userGoals = goalRepository.findByUser(user);
            for (Goal goal : userGoals) {
                if (goal.getUnit() != null && goal.getUnit().equalsIgnoreCase("hours")) {
                    goal.setCurrentValue(goal.getCurrentValue() + hours);
                    goalRepository.save(goal);
                }
            }
        }

        return questRepository.save(quest);
    }

    @Transactional
    public void deleteQuest(Long questId) {
        if (questId == null)
            throw new IllegalArgumentException("Quest ID cannot be null");
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!quest.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        questRepository.delete(quest);
    }
}
