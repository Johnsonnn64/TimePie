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
  INSERT INTO categories (guild_id, user_id, category)
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
function assignBudget(name, hours, minutes){

}

// Start the time for the chosen category
function startTime(name){

}

// Stop the time for the chosen category
function stopTime(name){
    
}

module.exports = {
    addCategory,
    deleteCategory,
    showAllCategory,
    assignBudget
};
