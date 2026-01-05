package com.pokework.controller;

import com.pokework.model.Quest;
import com.pokework.service.QuestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public ResponseEntity<List<Quest>> getQuests() {
        return ResponseEntity.ok(questService.getMyQuests());
    }

    @PostMapping
    public ResponseEntity<Quest> createQuest(@RequestBody Quest quest) {
        return ResponseEntity.ok(questService.createQuest(quest));
    }

    @PostMapping("/{id}/finish")
    public ResponseEntity<Quest> finishQuest(@PathVariable Long id, @RequestParam double hours) {
        return ResponseEntity.ok(questService.finishQuest(id, hours));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuest(@PathVariable Long id) {
        questService.deleteQuest(id);
        return ResponseEntity.noContent().build();
    }
}
