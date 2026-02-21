require("dotenv").config();
const { Client, GatewayIntentBits, AttachmentBuilder, Message } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("pong!");
  }

  if (interaction.commandName === "sprite"){
    const myAttachment = new AttachmentBuilder('./dead.png');
    await interaction.channel.send({ files: [myAttachment]});
  }
});

client.login(process.env.DISCORD_TOKEN);
