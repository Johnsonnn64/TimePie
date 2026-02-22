require("dotenv").config();
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, Message, Attachment } = require("discord.js");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const pieChart = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
const pieChart2 = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
const pieChart3 = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
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
        labels: ['Apples', 'Bananas', 'Cherries', 'Dates', 'Peaches', 'Pears', 'Blueberries', 'Strawberries', 'Kiwis', 'Oranges'],
        datasets: [{
          data: [5, 5, 15, 5, 5, 25, 15, 15, 5, 5],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33', '#acc9ff', '#f6ffb2', '#d67979', '#9985f0', '#bcffce', '#06f5ed'],
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'right', // vertical legend
            labels: {
              boxWidth: 30,    // bigger color boxes
              font: {size: 18}, //bigger text
              padding: 20      // spacing between items
            }
          }
        }
      }
    };

    const image2 = await pieChart2.renderToBuffer(pieConfig2);
    const pie2 = new AttachmentBuilder(image2, { name: 'Image2.png' });

      const pieConfig3 = {
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
          legend: {
            display: true,
            position: 'right', // vertical legend
            labels: {
              boxWidth: 30,    // bigger color boxes
              font: {size: 18}, //bigger text
              padding: 20      // spacing between items
            }
          }
        }
      }
    };

    const image3 = await pieChart3.renderToBuffer(pieConfig3);
    const pie3 = new AttachmentBuilder(image3, { name: 'Image3.png' });

    //The embed for our statement that holds the information.
    const statement = new EmbedBuilder()
      .setColor('#feffb9')
      .setTitle((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' Statement')
      .setDescription('Below is today\'s breakdown:')
      .addFields(
        {name: '(+/-)some field here: some number here', value: ' ', inline: false},
      )
      .setTimestamp();

    interaction.reply({ embeds: [statement], files: [image2, image3]});
  }

});

client.login(process.env.DISCORD_TOKEN);
