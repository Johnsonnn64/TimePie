const Database = require("better-sqlite3");

const db = new Database("data.sqlite");

db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS categories (
    guild_id TEXT NO NULL,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    PRIMARY KEY (guild_id, user_id, category)
  );

  CREATE TABLE IF NOT EXISTS active_sessions (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    start_time INTEGER NOT NULL,
    PRIMARY KEY (guild_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
  guild_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_min INTEGER NOT NULL CHECK (duration_min >= 0),
  PRIMARY KEY (guild_id, user_id, category)
);


  CREATE TABLE IF NOT EXISTS budgets (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    daily_min INTEGER NOT NULL CHECK (daily_min >= 0),
    PRIMARY KEY (guild_id, user_id, category)
  );
`)

module.exports = db;
