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
    const name = interaction.options.getString("category");

    if (sub === "add") {
      addCategory.run(guildId, userId, name);
      return interaction.reply({ content: `Added category: **${name}**`, ephemeral: true});
    }

    if (sub === "delete") {
      deleteCategory.run(guildId, userId, name);
      return interaction.reply({content: `Deleted category: **${name}**`, ephemeral: true});
    }

    if (sub === "showAll") {
      const result = showAllCategory.run(guildId, userId);

      return interaction.reply({content: result, ephemeral: true});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
