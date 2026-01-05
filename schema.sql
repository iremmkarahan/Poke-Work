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
CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    evolution_stage TEXT DEFAULT 'Basic',
    last_updated TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: quests
-- Tracks user-defined tasks and earned XP.
CREATE TABLE IF NOT EXISTS quests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    earned_xp INTEGER DEFAULT 0,
    difficulty TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Initial seed data
INSERT OR IGNORE INTO pokemon (id, name, level, current_xp, total_xp, evolution_stage)
VALUES (1, 'Starter', 1, 0, 0, 'Basic');
