package com.pokework.dao;

import com.pokework.model.Pokemon;

/**
 * Data Access Object for Pokemon.
 * Handles all SQL operations for the 'pokemon' table.
 */
public class PokemonDAO {

    /**
     * Gets the user's pokemon (assuming only 1 exists).
     */
    public Pokemon getPokemon() {
        // TODO: Select the row from 'pokemon' table
        // Map the ResultSet columns to a new Pokemon object
        return null; 
    }

    /**
     * Updates the existing pokemon's stats (XP, level, etc).
     */
    public void update(Pokemon pokemon) {
        // TODO: Write SQL: "UPDATE pokemon SET level=?, current_xp=?, total_xp=?, evolution=? WHERE id=?"
    }
}
