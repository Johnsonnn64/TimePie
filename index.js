require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const category = require("./category.js");

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

  // When user calls "/budget"
  if (interaction.commandName === "budget") {
      const name = interaction.options.getString("name");
      const hours = interaction.options.getString("hours");
      const minutes = interaction.options.getString("minutes");
      const result = category.assignBudget(name, hours, minutes);
      return interaction.reply(result);
  }

  // When user calls "/start"
  if (interaction.commandName === "start") {
      const name = interaction.options.getString("name");
      const result = category.startTime(name);
      return interaction.reply(result);
  }

  // When user calls "/stop"
  if (interaction.commandName === "stop") {
      const name = interaction.options.getString("name");
      const result = category.stopTime(name);
      return interaction.reply(result);
  }
});

client.login(process.env.DISCORD_TOKEN);
