require("dotenv").config();
const { Client, GatewayIntentBits, AttachmentBuilder, Message } = require("discord.js");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const pieChart = new ChartJSNodeCanvas({width: 500}, {height: 500}); //pixel x pixel size
const pieChartPlanned = new ChartJSNodeCanvas({width: 250}, {height: 250}); //pixel x pixel size
const pieChartActual = new ChartJSNodeCanvas({width: 250}, {height: 250}); //pixel x pixel size

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

  if (interaction.commandName === "testpiechart"){

    const pieConfig = {
      type: 'pie',
      data: {
        labels: ['Apples', 'Bananas', 'Cherries', 'Dates'],
        datasets: [{
          data: [15, 30, 45, 10],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33'],
        }]
      }
    };

    const image = await pieChart.renderToBuffer(pieConfig);

    const pieImage = new AttachmentBuilder(image, { name: 'piechart.png' });

    interaction.channel.send({ files: [pieImage] });
  }

});

client.login(process.env.DISCORD_TOKEN);
