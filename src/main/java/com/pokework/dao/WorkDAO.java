package com.pokework.dao;

import com.pokework.model.WorkSession;
import java.util.List;

/**
 * Data Access Object for WorkSession.
 * Handles all SQL operations for the 'work_sessions' table.
 */
public class WorkDAO {

    /**
     * Inserts a new work session into the database.
     */
    public void save(WorkSession session) {
        // TODO: 1. Get connection from Database.getConnection()
        // TODO: 2. Write SQL: "INSERT INTO work_sessions (work_date, hours) VALUES (?, ?)"
        // TODO: 3. Create PreparedStatement and set values
        // TODO: 4. Execute update
    }

    /**
     * Retrieves all work sessions.
     */
    public List<WorkSession> findAll() {
        // TODO: Select all rows and convert them to WorkSession objects
        return null;
    }
}
