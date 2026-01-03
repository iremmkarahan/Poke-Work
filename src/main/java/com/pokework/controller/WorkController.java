package com.pokework.controller;

import com.pokework.dto.WorkRequest;
import com.pokework.model.WorkSession;
import com.pokework.service.WorkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work")
public class WorkController {

    private final WorkService workService;

    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    @GetMapping
    public ResponseEntity<List<WorkSession>> getSessions() {
        return ResponseEntity.ok(workService.getMySessions());
    }

    @PostMapping
    public ResponseEntity<WorkSession> logSession(@RequestBody WorkRequest request) {
        return ResponseEntity.ok(workService.logSession(request));
    }
}
