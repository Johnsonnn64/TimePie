require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const category = require("./category.js")

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
      // .addSubcommand(sub => 
      //   sub.setName("showAll").setDescription("Show all category").setRequired(true)
      // ),
].map(c => c.toJSON());

(async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  console.log("Registered commands.");
})();

