package com.pokework.model;

/**
 * Represents the user's gamified character.
 * This class corresponds to the 'pokemon' table in the database.
 */
public class Pokemon {
    private int id;
    private String name;
    private int level;
    private int currentXp;
    private int totalXp;
    private String evolutionStage;

    // Default constructor
    public Pokemon() {
    }

    // Full constructor
    public Pokemon(int id, String name, int level, int currentXp, int totalXp, String evolutionStage) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.currentXp = currentXp;
        this.totalXp = totalXp;
        this.evolutionStage = evolutionStage;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    @Override
    public String toString() {
        return "Pokemon [id=" + id + ", name=" + name + ", level=" + level + ", currentXp=" + currentXp
                + ", totalXp=" + totalXp + ", evolutionStage=" + evolutionStage + "]";
    }
}
