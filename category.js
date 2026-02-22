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
`);

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

const stopSession = db.prepare(`
  INSERT INTO sessions (guild_id, user_id, category, start_time, end_time, duration_min)
  VALUES (?, ?, ?, ?, ?, ?)
  `);


// Stop the time for the chosen category
function stopTime(guildId, userId, category){
    const active = getActive.get(guildId, userId);
    
    const now = Date.now();
    const duration = active.duration + Math.floor((now - active.start_time)/60000);

    stopSession.run(guildId, userId, category, active.start_time, now, duration);
    deleteActive.run(guildId, userId);
    return `End tracking **${category}** at ${new Date(now).toLocaleTimeString()}. \nDuration was **${duration}** min`;
}

//const statement=db.prepare();

//const statementPlanned=db.prepare();

//const statementActual=db.prepare()

module.exports = {
    addCategory,
    deleteCategory,
    showAllCategory,
    assignBudget,
    startTime,
    stopTime
};
