package com.pokework.service;

import com.pokework.model.Goal;
import com.pokework.model.User;
import com.pokework.repository.GoalRepository;
import com.pokework.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public List<Goal> getMyGoals() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return goalRepository.findByUser(user);
    }

    @Transactional
    public Goal createGoal(Goal goal) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    @Transactional
    public Goal updateGoal(Long goalId, Goal goalDetails) {
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!goal.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        goal.setTitle(goalDetails.getTitle());
        goal.setTargetValue(goalDetails.getTargetValue());
        goal.setCurrentValue(goalDetails.getCurrentValue());
        goal.setUnit(goalDetails.getUnit());
        goal.setColor(goalDetails.getColor());

        return goalRepository.save(goal);
    }

    @Transactional
    public void deleteGoal(Long goalId) {
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!goal.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        goalRepository.delete(goal);
    }
}
