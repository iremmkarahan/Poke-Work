package com.pokework.service;

import com.pokework.dto.RegisterRequest;
import com.pokework.model.Pokemon;
import com.pokework.model.User;
import com.pokework.repository.PokemonRepository;
import com.pokework.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PokemonRepository pokemonRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PokemonRepository pokemonRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.pokemonRepository = pokemonRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // 1. Create and Save User
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (userRepository.count() == 0) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        user = userRepository.save(user);

        // 2. Grant Starter Pokemon
        Pokemon starter = new Pokemon(user, "Charmander"); // Default starter
        pokemonRepository.save(starter);

        return user;
    }
}
