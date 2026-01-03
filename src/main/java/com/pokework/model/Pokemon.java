package com.pokework.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pokemon")
public class Pokemon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String name;
    private int level = 1;
    private int currentXp = 0;
    private int totalXp = 0;
    private String evolutionStage = "Egg";

    // Constructors
    public Pokemon() {
    }

    public Pokemon(User user, String name) {
        this.user = user;
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
        updateEvolutionStage();
    }

    private void updateEvolutionStage() {
        if (level < 5)
            evolutionStage = "Egg";
        else if (level < 16)
            evolutionStage = "Basic";
        else if (level < 32)
            evolutionStage = "Stage 1";
        else if (level < 50)
            evolutionStage = "Stage 2";
        else
            evolutionStage = "Legendary";
    }

    public int getCurrentXp() {
        return currentXp;
    }

    public void setCurrentXp(int currentXp) {
        this.currentXp = currentXp;
    }

    public int getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(int totalXp) {
        this.totalXp = totalXp;
    }

    public String getEvolutionStage() {
        return evolutionStage;
    }

    public void setEvolutionStage(String evolutionStage) {
        this.evolutionStage = evolutionStage;
    }
}
