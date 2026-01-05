package com.pokework.dto;

public class DashboardResponse {
    private String trainerName;
    private String pokemonName;
    private int level;
    private int currentXp;
    private int totalXp;
    private String evolutionStage;
    private String role;
    private String status;
    private String profilePictureUrl;

    // Constructors
    public DashboardResponse(String trainerName, String pokemonName, int level, int currentXp, int totalXp,
            String evolutionStage, String role, String status, String profilePictureUrl) {
        this.trainerName = trainerName;
        this.pokemonName = pokemonName;
        this.level = level;
        this.currentXp = currentXp;
        this.totalXp = totalXp;
        this.evolutionStage = evolutionStage;
        this.role = role;
        this.status = status;
        this.profilePictureUrl = profilePictureUrl;
    }

    // Getters
    public String getTrainerName() {
        return trainerName;
    }

    public String getPokemonName() {
        return pokemonName;
    }

    public int getLevel() {
        return level;
    }

    public int getCurrentXp() {
        return currentXp;
    }

    public int getTotalXp() {
        return totalXp;
    }

    public String getEvolutionStage() {
        return evolutionStage;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
}
