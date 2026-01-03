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
        // TODO: Validate password length, etc.
        User newUser = authService.register(request);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        // For MVP, we'll just check if user exists.
        // Real implementation would involve AuthenticationManager and JWT generation.
        // Returning a dummy token for now.
        return ResponseEntity.ok("dummy-jwt-token-xyz");
    }
}
