package com.pokework.repository;

import com.pokework.model.Goal;
import com.pokework.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);

    List<Goal> findByUserAndUnit(User user, String unit);
}
