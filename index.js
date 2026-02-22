require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { addCategory, deleteCategory, showAllCategory } = require("./category");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const guildId = interaction.guildId;
  const userId = interaction.user.id;
  const now = Math.floor(Date.now() / 1000);

  // When user calls "/ping"
  if (interaction.commandName === "ping") {
    await interaction.reply("pong!");
  }

  // When user calls "/category"
  if (interaction.commandName === "category") {
    const sub = interaction.options.getSubcommand();
    const category = interaction.options.getString("category");

    if (sub === "add") {
      addCategory.run(guildId, userId, category);
      return interaction.reply({ content: `Added category: **${category}**`, ephemeral: true});
    }

    if (sub === "delete") {
      deleteCategory.run(guildId, userId, category);
      return interaction.reply({content: `Deleted category: **${category}**`, ephemeral: true});
    }

    if (sub === "showAll") {
      const result = showAllCategory.run(guildId, userId);

      return interaction.reply({content: result, ephemeral: true});
    }
  }

  // When user calls "/budget"
  if (interaction.commandName === "budget") {
      const category = interaction.options.getString("category");
      const hours = interaction.options.getString("hours");
      const minutes = interaction.options.getString("minutes");
      const result = category.assignBudget(category, hours, minutes);
      return interaction.reply(result);
  }

  // When user calls "/start"
  if (interaction.commandName === "start") {
      const category = interaction.options.getString("category");
      const result = category.startTime(category);
      return interaction.reply(result);
  }

  // When user calls "/stop"
  if (interaction.commandName === "stop") {
      const category = interaction.options.getString("category");
      const result = category.stopTime(category);
      return interaction.reply(result);
  }
});

client.login(process.env.DISCORD_TOKEN);
