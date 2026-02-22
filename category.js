const { SlashCommandBuilder } = require("discord.js");
const path = require("path");

// TODO: Path to SQLite

// TODO: Load the categories from SQLite
function loadCategories() {
    
}

// TODO: Save the categories to SQLite
function saveCategories(categories) {

}


// Add the name of the new category and check if the category already exist.
// If it's a new name category, at it to category list in SQLite
function addCategory(name){

}

// Delete the name of the category the user input. Check if that category exist.
// If exist, delete it
// If not exist, show user an error message
function deleteCategory(name){
 
}

// Show all existing category that was created
function showAllCategory(){

}

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
    loadCategories,
    addCategory,
    deleteCategory,
    showAllCategory,
    assignBudget
};
