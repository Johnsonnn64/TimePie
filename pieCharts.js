require("dotenv").config();

const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { createCanvas, loadImage } = require('canvas');

//creating pie charts
const pieChartPlanned = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
const pieChartActual = new ChartJSNodeCanvas({width: 500, height: 500}); //pixel x pixel size
//the date

async function buildStatementAssets() {
const date = new Date();

    const plannedConfig = {
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

      const actualConfig = {
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

    const imagePlannedBuf = await pieChartPlanned.renderToBuffer(plannedConfig);
    const imageActualBuf = await pieChartActual.renderToBuffer(actualConfig);

    //combine two images:
    const img1 = await loadImage(imagePlannedBuf);
    const img2 = await loadImage(imageActualBuf);
    const canvas = createCanvas((img1.width + img2.width), (img1.height));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img1, 0, 0);
    ctx.drawImage(img2, img1.width, 0);
    const combinedImage = canvas.toBuffer();
    const comboImage = new AttachmentBuilder(combinedImage, { name: 'comboImage.png' });

    //The embed for our statement that holds the information.
    const statement = new EmbedBuilder()
      .setColor('#feffb9')
      .setTitle((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' Statement')
      .setDescription('Below is today\'s breakdown:')
      .addFields(
        {name: '(+/-)some field here: some number here', value: ' ', inline: false},
      )
      .setTimestamp();
  return { comboImage, statement }
}

module.exports = { buildStatementAssets }

