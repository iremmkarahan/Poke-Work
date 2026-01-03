package com.pokework.service;

import com.pokework.dto.WorkRequest;
import com.pokework.model.Pokemon;
import com.pokework.model.User;
import com.pokework.model.WorkSession;
import com.pokework.repository.PokemonRepository;
import com.pokework.repository.UserRepository;
import com.pokework.repository.WorkSessionRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class WorkService {

    private final WorkSessionRepository workSessionRepository;
    private final PokemonRepository pokemonRepository;
    private final UserRepository userRepository;

    public WorkService(WorkSessionRepository workSessionRepository, PokemonRepository pokemonRepository,
            UserRepository userRepository) {
        this.workSessionRepository = workSessionRepository;
        this.pokemonRepository = pokemonRepository;
        this.userRepository = userRepository;
    }

    public List<WorkSession> getMySessions() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return workSessionRepository.findByUserId(user.getId());
    }

    @Transactional
    public WorkSession logSession(WorkRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Save Session
        WorkSession session = new WorkSession(user, request.getDate() != null ? request.getDate() : LocalDate.now(),
                request.getHours());
        workSessionRepository.save(session);

        // 2. Add XP to Pokemon
        Pokemon p = user.getPokemon();
        if (p != null) {
            int earnedXp = (int) (request.getHours() * 10); // 1 hour = 10 XP
            p.setCurrentXp(p.getCurrentXp() + earnedXp);
            p.setTotalXp(p.getTotalXp() + earnedXp);

            // Level Up Logic (Simple: 100 XP per level)
            while (p.getCurrentXp() >= 100) {
                p.setCurrentXp(p.getCurrentXp() - 100);
                p.setLevel(p.getLevel() + 1); // Triggers updateEvolutionStage
            }

            pokemonRepository.save(p);
        }

        return session;
    }
}
