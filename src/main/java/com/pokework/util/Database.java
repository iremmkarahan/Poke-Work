package com.pokework.util;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * Handles the connection to the SQLite database.
 */
public class Database {
    
    // Connection string for SQLite
    private static final String URL = "jdbc:sqlite:pokework.db";

    /**
     * returns a new Connection to the database.
     * Use this method in your DAOs.
     */
    public static Connection getConnection() throws SQLException {
        // TODO: Implement the connection logic using DriverManager
        // return DriverManager.getConnection(URL);
        return null; // Placeholder
    }
}
