package com.pokework.service;

/**
 * Handles gamification logic (XP, leveling, evolution).
 */
public class GameService {

    // private PokemonDAO pokemonDAO = new PokemonDAO();

    /**
     * Called when work is logged. Updates the pokemon's progress.
     */
    public void processSession(double hours) {
        // TODO: 1. Fetch current Pokemon
        // TODO: 2. Calculate gained XP (e.g. hours * 100)
        // TODO: 3. Add to current XP and Total XP
        // TODO: 4. Check for level up (while currentXP >= threshold)
        // TODO: 5. Save updates via PokemonDAO
    }
    
    // Helper to calculate XP needed for next level
    // private int getXpThreshold(int level) { ... }
}
