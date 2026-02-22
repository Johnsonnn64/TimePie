const db = require("./db");
// TODO: Path to SQLite

// TODO: Load the categories from SQLite
function loadCategories() {
    
}

// TODO: Save the categories to SQLite
function saveCategories(categories) {

}


// Add the name of the new category and check if the category already exist.
// If it's a new name category, at it to category list in SQLite
const addCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (guild_id, user_id, category)
  VALUES (?, ?, ?)
`)

// Delete the name of the category the user input. Check if that category exist.
// If exist, delete it
// If not exist, show user an error message
const deleteCategory = db.prepare(`
  DELETE FROM categories 
  WHERE guild_id=? AND user_id=? AND category=?
`)

// Show all existing category that was created
const showAllCategory = db.prepare(`
  SELECT category
  FROM categories
  WHERE guild_id=? AND user_id=?
  ORDER BY category
`);

// Assign the time that the user want to spend for the specific category
const assignBudget = db.prepare(`
  INSERT INTO budgets (guild_id, user_id, category, daily_min) 
  VALUES (?, ?, ?, ?)
  ON CONFLICT(guild_id, user_id, category)
  DO UPDATE SET daily_min = excluded.daily_min
`);

const deleteBudget = db.prepare(`
  DELETE FROM budgets
  WHERE guild_id=? AND user_id=? AND category=?
`)

const getActive = db.prepare(`
  SELECT category, start_time
  FROM active_sessions
  WHERE guild_id=? AND user_id=?
  `);

const startSession = db.prepare(`
  INSERT INTO active_sessions (guild_id, user_id, category, start_time)
  VALUES (?, ?, ?, ?)
  `);

// Start the time for the chosen category
function startTime(guildId, userId, category){
  const active = getActive.get(guildId, userId);

  if(active){
    return `You already have a timmer running for **${active.category}**. Stop it first before starting a new one.`;
  }

  const now = Date.now();
  startSession.run(guildId, userId, category, now);
  
  return `Start tracking **${category}** at ${new Date(now).toLocaleTimeString()}.`;
};

const deleteActive = db.prepare(`
  DELETE FROM active_sessions
  WHERE guild_id = ? AND user_id = ?
  `);

const deleteSession = db.prepare(`
  DELETE FROM sessions
  WHERE guild_id = ? AND user_id = ? AND category = ?
  `);

const addSession = db.prepare(`
  INSERT INTO sessions (guild_id, user_id, category, duration_min)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(guild_id, user_id, category)
  DO UPDATE SET duration_min = sessions.duration_min + excluded.duration_min
  `);


// Stop the time for the chosen category
function stopTime(guildId, userId){
    const active = getActive.get(guildId, userId);
    
    const now = Date.now();
    const duration = Math.floor((now - active.start_time)/60000);

    addSession.run(guildId, userId, active.category, duration);
    deleteActive.run(guildId, userId);
    return `End tracking **${active.category}** at ${new Date(now).toLocaleTimeString()}. \nDuration was **${duration}** min`;
}

const getPCategory = db.prepare(`
  SELECT category
  FROM budgets
  WHERE guild_id=? AND user_id=?
  ORDER BY category
`)

const getACategory = db.prepare(`
  SELECT category
  FROM sessions
  WHERE guild_id=? AND user_id=?
  ORDER BY category
`)

const getPData = db.prepare(`
  SELECT daily_min
  FROM budgets
  WHERE guild_id=? AND user_id=?
  ORDER BY category
`)

const getAData = db.prepare(`
  SELECT duration_min
  FROM sessions
  WHERE guild_id=? AND user_id=?
  ORDER BY category
`)

module.exports = {
  addCategory,
  deleteCategory,
  showAllCategory,
  assignBudget,
  deleteBudget,
  deleteSession,
  startTime,
  stopTime,
  addSession,
  getPCategory,
  getACategory,
  getPData,
  getAData,
};
