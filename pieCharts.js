require("dotenv").config();

// check the requirements
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { createCanvas, loadImage } = require('canvas');

// client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// creating pie charts
const pieChartPlanned = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
const pieChartActual = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
// getting the date
const date = new Date();

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
 
  //response to user typing /statement
  if (interaction.commandName === "statement"){

    // the planned pie chart
    const piePlannedConfig = {
      type: 'pie',
      data: {
        labels: ['Apples', 'Bananas', 'Cherries', 'Dates', 'Peaches', 'Pears', 'Blueberries', 'Strawberries', 'Kiwis', 'Oranges'],
        datasets: [{
          data: [5, 5, 15, 5, 5, 25, 15, 15, 5, 5],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33', '#acc9ff', '#f6ffb2', '#d67979', '#9985f0', '#bcffce', '#06f5ed'],
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Planned',
            align: 'start',
            font: { size: 35, weight: 'bold'}
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 30,
              font: {size: 18},
              padding: 20
            }
          }
        }
      }
    };

    //make an image
    const imagePlanned = await pieChartPlanned.renderToBuffer(piePlannedConfig);
    
    // the actual pie chart
    const pieActualConfig = {
      type: 'pie',
      data: {
        labels: ['Apples', 'Bananas', 'Cherries', 'Dates', 'Peaches', 'Pears', 'Blueberries', 'Strawberries', 'Kiwis', 'Oranges'],
        datasets: [{
          data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33', '#acc9ff', '#f6ffb2', '#d67979', '#9985f0', '#bcffce', '#06f5ed'],
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Actual',
            align: 'start',
            font: { size: 35, weight: 'bold'}
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 30,
              font: {size: 18},
              padding: 20
            }
          }
        }
      }
    };

    // make an image
    const imageActual = await pieChartActual.renderToBuffer(pieActualConfig);

    // load the two pie chart images:
    const imgPlanned = await loadImage(imagePlanned);
    const imgActual = await loadImage(imageActual);
    // create a new canvas on which to place both images
    const canvas = createCanvas((imgPlanned.width + imgActual.width), (imgPlanned.height));
    const ctx = canvas.getContext('2d');
    // place the images on the new canvas, side by side
    ctx.drawImage(imgPlanned, 0, 0);
    ctx.drawImage(imgActual, imgPlanned.width, 0);
    // place the canvas in the image
    const combinedImage = canvas.toBuffer();
    // create the attachment
    const comboChartImage = new AttachmentBuilder(combinedImage, { name: 'comboChartImage.png' });

    // the embed for our statement that holds the information.
    const statement = new EmbedBuilder()
      .setColor('#feffb9')
      .setTitle((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' Statement')
      .setDescription('Below is today\'s breakdown:')
      .addFields(
        {name: '(+/-)some field here: some number here', value: ' ', inline: false},
      )
      .setTimestamp();

    // have the bot reply with the embed and the image
    interaction.reply({ embeds: [statement], files: [comboChartImage]});
  }

});

client.login(process.env.DISCORD_TOKEN);
