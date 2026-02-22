require("dotenv").config();
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, Message, Attachment } = require("discord.js");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { createCanvas, loadImage } = require('canvas');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const pieChart = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
const pieChart2 = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
const date = new Date();

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

    interaction.channel.send({ files: [pieImage, pieImage] });
  }

  if (interaction.commandName === "teststatement"){

    const pieConfig2 = {
      type: 'pie',
      data: {
        labels: ['Apples', 'Bananas', 'Cherries', 'Dates'],
        datasets: [{
          data: [15, 30, 45, 10],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33'],
        }]
      }
    };

    const image2 = await pieChart2.renderToBuffer(pieConfig2);

    const pieImage2 = new AttachmentBuilder(image2, { name: 'piechart2.png' });

    //combine two images:
    const img1 = await loadImage(image2);
    const img2 = await loadImage(image2);
    const canvas = createCanvas((img1.width + img2.width), (img1.height + img2.height));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img1, 0, 0);
    ctx.drawImage(img2, img1.width, 0);
    const combinedImage = canvas.toBuffer();
    const comboImage = new AttachmentBuilder(combinedImage, { name: 'comboImage.png' });

    //The embed for our statement that holds the information.
    const statement = new EmbedBuilder()
      .setTitle('Here is today\'s Statement:')
      .setDescription('Today\'s Date: ' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear())
      .setImage('attachment://comboImage.png')
      .addFields(
        {name: 'Planned Time Allotment', value: ' ', inline: true},
        {name: 'Actual Time Allotment', value: ' ', inline: true},
      )
      .setTimestamp()

    interaction.reply({ embeds: [statement], files: [comboImage]});
  }

});

client.login(process.env.DISCORD_TOKEN);
