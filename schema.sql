-- Database Schema for Poke-Work-Evolution

-- 1. Table: work_sessions
-- Tracks the user's daily work inputs.
CREATE TABLE IF NOT EXISTS work_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_date TEXT NOT NULL,       -- Stored as ISO8601 string 'YYYY-MM-DD'
    hours REAL NOT NULL,           -- Use REAL for decimals (e.g., 2.5 hours)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: pokemon
-- Stores the user's gamified progress.
-- We only need one row for the single user, but a table allows future multi-save slots.
CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,        -- Usually ID=1
    name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    evolution_stage TEXT DEFAULT 'Basic', -- e.g., 'Charmander'
    last_updated TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Initial seed data (if the table is empty)
INSERT OR IGNORE INTO pokemon (id, name, level, current_xp, total_xp, evolution_stage)
VALUES (1, 'Starter', 1, 0, 0, 'Basic');
