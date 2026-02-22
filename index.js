require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const category = require("C:\Users\keila\OneDrive\Documents\GitHub\TimePie\category.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // When user calls "/ping"
  if (interaction.commandName === "ping") {
    await interaction.reply("pong!");
  }

  // When user calls "/category"
  if (interaction.commandName === "category") {
    const sub = interaction.options.getSubcommand();

    if (sub === "add") {
      const name = interaction.options.getString("name");
      const result = category.addCategory(name);
      return interaction.reply(result);
    }

    if (sub === "delete") {
      const name = interaction.options.getString("name");
      const result = category.deleteCategory(name);
      return interaction.reply(result);
    }

    if (sub === "showAll") {
      const result = category.showAllCategory();
      return interaction.reply(result);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
