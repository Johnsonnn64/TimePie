require("dotenv").config();
const db = require("./db");
const { Client, GatewayIntentBits, MessageFlags } = require("discord.js");
const { addCategory, deleteCategory, showAllCategory, assignBudget, startTime } = require("./category");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  const guildId = interaction.guildId;
  const userId = interaction.user.id;

  function checkExists(category) {
    const exists = !!db.prepare(`
      SELECT 1 FROM categories WHERE guild_id=? AND user_id=? AND category=?
    `).get(guildId, userId, category)

    return exists;
  }

  // When user calls "/ping"
  if (interaction.commandName === "ping") {
    await interaction.reply("pong!");
  }

  if (interaction.isAutocomplete()) {
    const focused = interaction.options.getFocused(true);

    if (focused.name !== "category") return interaction.respond([]);

    const cmd = interaction.commandName;
    if ( cmd !== "category" && cmd !== "budget" ) return interaction.respond([])

    const typed = String(focused.value || "").toLowerCase();

    const result = showAllCategory.all(guildId, userId);
    const c = result.map(r => r.category);

    const suggestions = c.filter( 
      n => n.toLowerCase() 
      .includes(typed))
      .slice(0, 25)
      .map(n => ({ name: n, value: n})
    );

    return interaction.respond(suggestions);
  }

  // When user calls "/category"
  if (interaction.commandName === "category") {
    const sub = interaction.options.getSubcommand();
    const category = interaction.options.getString("category");
    const exists = checkExists(category);

    if (sub === "add") {
      var content = `Category **${category}** already exists`;

      if (!exists) {
        content = `Added category: **${category}**`
        addCategory.run(guildId, userId, category);
      } 

      await interaction.reply({ 
        content: content,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (sub === "delete") {
      var content = `Category **${category}** does not exist`;
      if (exists) {
        content = `Deleted category: **${category}**`;
        deleteCategory.run(guildId, userId, category);
      }

      await interaction.reply({
        content: content,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (sub === "showall") {
      var result = showAllCategory.all(guildId, userId);
      const c = result.map(r => r.category);

      await interaction.reply({
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
      var content = `Category **${category}** does not exist`;

      if (checkExists(category)) {
        content = `Assigned ${hours} hours and ${minutes} minutes to ${category}`;
        assignBudget.run(guildId, userId, category, min)
      }
      
      await interaction.reply({
        content: content,
        flags: MessageFlags.Ephemeral,
      });
  }

  // When user calls "/start"
  if (interaction.commandName === "start") {
      const category = interaction.options.getString("category");
      const result = startTime(guildId, userId, category);
      await interaction.reply(result);
  }


  // When user calls "/stop"
  if (interaction.commandName === "stop") {
      const category = interaction.options.getString("category");
      const result = category.stopTime(category);
      await interaction.reply(result);
  }
});

client.login(process.env.DISCORD_TOKEN);
