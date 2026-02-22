require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  // When the user types "/ping"
  new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),

  // When the user types "/category", show them the options they can choose from
  new SlashCommandBuilder()
    .setName("category")
    .setDescription("Manage categories")
    .addSubcommand(sub => 
      sub.setName("add")
        .setDescription("Add a new category")
        .addStringOption(option => 
          option.setName("category")
            .setDescription("Name of the category")
            .setRequired(true)
        )
    )
    .addSubcommand(sub => 
      sub.setName("delete")
        .setDescription("Delete an existing category")
        .addStringOption(option=> 
          option.setName("category")
            .setDescription("Name of the category")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(sub => 
    sub.setName("showall").setDescription("Show all category")
    ),

    new SlashCommandBuilder()
      .setName("budget")
      .setDescription("Budget time for the chosen category")
      .addSubcommand(sub =>
        sub.setName("add")
          .setDescription("Add a new budget")
          .addStringOption(option => 
          option.setName("category")
            .setDescription("Name of the category")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addIntegerOption(option => 
          option.setName("hours")
            .setDescription("Number of hours")
            .setRequired(true)
        )
        .addIntegerOption(option => 
          option.setName("minutes")
            .setDescription("Number of minutes")
            .setRequired(true)
        ),
      )
      .addSubcommand(sub =>
        sub.setName("delete")
          .setDescription("Delete a budget")
          .addStringOption(option =>
          option.setName("category")
            .setDescription("Name of category")
            .setRequired(true)
            .setAutocomplete(true)
      )
    ),

    new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start the time for the chosen category")
    .addStringOption(option => 
      option.setName("category")
        .setDescription("Name of the category")
        .setRequired(true)
        .setAutocomplete(true)
    ),
    
    new SlashCommandBuilder()
    .setName("stop")
    .setDescription("stop the time for the chosen category"),

  // When the user types "/statement", show them the options they can choose from
  new SlashCommandBuilder()
  .setName("statement")
  .setDescription("Shows the pie graph")
    
].map(c => c.toJSON());

(async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  console.log("Registered commands.");
})();

