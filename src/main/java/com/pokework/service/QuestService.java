package com.pokework.service;

import com.pokework.model.Quest;
import com.pokework.model.User;
import com.pokework.model.WorkSession;
import com.pokework.model.Pokemon;
import com.pokework.repository.QuestRepository;
import com.pokework.repository.UserRepository;
import com.pokework.repository.WorkSessionRepository;
import com.pokework.repository.PokemonRepository;
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

    public QuestService(QuestRepository questRepository, UserRepository userRepository,
            WorkSessionRepository workSessionRepository, PokemonRepository pokemonRepository) {
        this.questRepository = questRepository;
        this.userRepository = userRepository;
        this.workSessionRepository = workSessionRepository;
        this.pokemonRepository = pokemonRepository;
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

        // 1. Calculate XP
        int earnedXp = (int) (hours * 10);
        quest.setEarnedXp(earnedXp);
        quest.setCompleted(true);

        // 2. Log Work Session
        User user = quest.getUser();
        WorkSession session = new WorkSession(user, java.time.LocalDate.now(), hours);
        workSessionRepository.save(session);

        // 3. Add XP to Pokemon
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

        return questRepository.save(quest);
    }

    @Transactional
    public void deleteQuest(Long questId) {
        if (questId == null)
            throw new IllegalArgumentException("Quest ID cannot be null");
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Quest found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!quest.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        questRepository.delete(quest);
    }
}
