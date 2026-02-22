require("dotenv").config();
const db = require("./db");
const { Client, GatewayIntentBits, MessageFlags } = require("discord.js");
const { addCategory, deleteCategory, showAllCategory, assignBudget, deleteBudget, startTime, stopTime, addSession, deleteSession, getPCategory, getACategory, getPData, getAData } = require("./category");
const { buildStatementAssets } = require("./pieCharts");
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

  // shows suggestions/ autocomplete for categories
  if (interaction.isAutocomplete()) {
    const focused = interaction.options.getFocused(true);

    if (focused.name !== "category") return interaction.respond([]);

    const cmd = interaction.commandName;
    if ( cmd !== "category" && cmd !== "budget" && cmd !== "start" ) return interaction.respond([])

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
        assignBudget.run(guildId, userId, category, 0)
        addSession.run(guildId, userId, category, 0)
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
        deleteBudget.run(guildId, userId, category);
        deleteSession.run(guildId, userId, category);
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
    const sub = interaction.options.getSubcommand();
    const category = interaction.options.getString("category");
    var content = `Category **${category}** does not exist`;
    if (sub === "add") {
      const hours = interaction.options.getInteger("hours");
      const minutes = interaction.options.getInteger("minutes");
      const min = hours * 60 + minutes;

      if (checkExists(category)) {
        content = `Assigned ${hours} hours and ${minutes} minutes to ${category}`;
        assignBudget.run(guildId, userId, category, min);
        addSession.run(guildId, userId, category, 0);
      }
    }
    if (sub === "delete") {
      if (checkExists(category)) {
        content = `Budget ${category} deleted`;
        deleteBudget.run(guildId, userId, category)
      }

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
      const result = stopTime(guildId, userId);
      await interaction.reply(result);
  }

  if (interaction.commandName === "statement") {
    const pCategory = getPCategory.all(guildId, userId);
    const pData = getPData.all(guildId, userId);
    const aCategory = getACategory.all(guildId, userId);
    const aData = getAData.all(guildId, userId);
    const pc = pCategory.map(r => r.category);
    const pd = pData.map(r => r.daily_min);
    const ac = aCategory.map(r => r.category);
    const ad = aData.map(r => r.duration_min);
    console.log(pc);
    console.log(pd);
    console.log(ac);
    console.log(ad);
    const { comboImage, statement } = await buildStatementAssets(pc, pd, ac, ad);
    return interaction.reply({
      embeds: [statement],
      files: [comboImage],
      flags: MessageFlags.Ephemeral
    })
  }
});

client.login(process.env.DISCORD_TOKEN);
