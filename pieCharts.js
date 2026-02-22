require("dotenv").config();

const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { createCanvas, loadImage } = require('canvas');

//creating pie charts
const pieChartPlanned = new ChartJSNodeCanvas({ width: 500, height: 500 }); //pixel x pixel size
const pieChartActual = new ChartJSNodeCanvas({ width: 500, height: 500 }); //pixel x pixel size
const backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33', '#acc9ff', '#f6ffb2', '#d67979', '#9985f0', '#bcffce', '#06f5ed'];
//the date

async function buildStatementAssets(plannedCategories, plannedData, actualCategories, actualData) {
  const date = new Date();
  const plannedConfig = {
    type: 'pie',
    data: {
      labels: plannedCategories,
      datasets: [{
        data: plannedData,
        backgroundColor: backgroundColor.slice(0, plannedCategories.length)
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Planned',
          align: 'start',
          font: { size: 35, weight: 'bold' }
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            boxWidth: 30,
            font: { size: 18 },
            padding: 20
          }
        }
      }
    }
  };

  const actualConfig = {
    type: 'pie',
    data: {
      labels: actualCategories,
      datasets: [{
        data: actualData,
        backgroundColor: backgroundColor.slice(0, plannedCategories.length)
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Actual',
          align: 'start',
          font: { size: 35, weight: 'bold' }
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            boxWidth: 30,
            font: { size: 18 },
            padding: 20
          }
        }
      }
    }
  };

  const imagePlannedBuf = await pieChartPlanned.renderToBuffer(plannedConfig);
  const imageActualBuf = await pieChartActual.renderToBuffer(actualConfig);

  //combine two images:
  const imgPlanned = await loadImage(imagePlannedBuf);
  const imgActual = await loadImage(imageActualBuf);
  const canvas = createCanvas((imgPlanned.width + imgActual.width), (imgPlanned.height));
  const ctx = canvas.getContext('2d');
  // place the images on the new canvas, side by side
  ctx.drawImage(imgPlanned, 0, 0);
  ctx.drawImage(imgActual, imgPlanned.width, 0);
  // place the canvas in the image
  const combinedImage = canvas.toBuffer();
  // create the attachment
  const comboImage = new AttachmentBuilder(combinedImage, { name: 'comboChartImage.png' });

  // the embed for our statement that holds the information.
  var plusMinus = [];
  for (let i = 0; i < plannedData.length; i ++) {
    plusMinus[i] = `${plannedCategories[i]}: ${actualData[i]}/${plannedData[i]}`;
  }

  const statement = new EmbedBuilder()
    .setColor('#feffb9')
    .setTitle((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' Statement')
    .setDescription('Below is today\'s breakdown:')
    .addFields(
      { name: plusMinus.join("\n"), value: ' ', inline: false },
    )
    .setTimestamp();
  return { comboImage, statement }
}

module.exports = { buildStatementAssets }

