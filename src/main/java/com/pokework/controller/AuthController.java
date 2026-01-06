package com.pokework.controller;

import com.pokework.dto.LoginRequest;
import com.pokework.dto.RegisterRequest;
import com.pokework.model.User;
import com.pokework.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User newUser = authService.register(request);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        User user = authService.verifyLogin(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(user);
    }
}
