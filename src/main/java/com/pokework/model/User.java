package com.pokework.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "USER" or "ADMIN"

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Pokemon pokemon;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<WorkSession> workSessions;

    // Constructors
    public User() {
    }

    public User(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Pokemon getPokemon() {
        return pokemon;
    }

    public void setPokemon(Pokemon pokemon) {
        this.pokemon = pokemon;
    }

    public List<WorkSession> getWorkSessions() {
        return workSessions;
    }

    public void setWorkSessions(List<WorkSession> workSessions) {
        this.workSessions = workSessions;
    }
}
