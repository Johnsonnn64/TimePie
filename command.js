require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!"),
  new SlashCommandBuilder().setName("sprite").setDescription("Puts a sprite image in chat."),
  new SlashCommandBuilder().setName("testpiechart").setDescription("Tests the pie chart."),
  new SlashCommandBuilder().setName("teststatement").setDescription("Tests the statement."),
].map(c => c.toJSON());

(async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log("Registered commands.");
})();
