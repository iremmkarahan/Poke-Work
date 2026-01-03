package com.pokework.config;

import com.pokework.model.Pokemon;
import com.pokework.model.User;
import com.pokework.repository.PokemonRepository;
import com.pokework.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PokemonRepository pokemonRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PokemonRepository pokemonRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.pokemonRepository = pokemonRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create default test user if database is empty
        if (userRepository.count() == 0) {
            // Create default admin user
            User defaultUser = new User();
            defaultUser.setUsername("admin");
            defaultUser.setPassword(passwordEncoder.encode("admin123"));
            defaultUser.setRole("ADMIN");
            defaultUser = userRepository.save(defaultUser);

            // Create starter Pokemon for default user
            Pokemon starter = new Pokemon(defaultUser, "Charmander");
            pokemonRepository.save(starter);

            System.out.println("========================================");
            System.out.println("Default test user created!");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("========================================");
        }
    }
}

