require("dotenv").config();
const { Client, GatewayIntentBits, MessageFlags } = require("discord.js");
const { addCategory, deleteCategory, showAllCategory, assignBudget } = require("./category");

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
      return interaction.reply({ 
        content: `Added category: **${category}**`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (sub === "delete") {
      deleteCategory.run(guildId, userId, category);
      return interaction.reply({
        content: `Deleted category: **${category}**`, 
        flags: MessageFlags.Ephemeral,
      });
    }

    if (sub === "showall") {
      const result = showAllCategory.all(guildId, userId);
      const c = result.map(r => r.category);

      return interaction.reply({
        content: `Your categories: ${JSON.stringify(c)}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // When user calls "/budget"
  if (interaction.commandName === "budget") {
      const category = interaction.options.getString("category");
      const hours = interaction.options.getString("hours");
      const minutes = interaction.options.getString("minutes");
      const min = hours * 60 + minutes;
      assignBudget.run(guildId, userId, category, min)
      
      return interaction.reply({
        content: `Assigned ${hours} hours and ${minutes} minutes to ${category}`,
        flags: MessageFlags.Ephemeral,
      });
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
