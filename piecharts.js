require("dotenv").config();

//setup for both the pie charts
const pieChartPlanned = new ChartJSNodeCanvas({width: 250, height: 250}); //pixel x pixel size
const pieChartActual = new ChartJSNodeCanvas({width: 250, height: 250}); //pixel x pixel size

//configuration for the planned pie chart
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

//configuration for the actual pie chart
    const pieActualConfig = {
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
//the buffer for the planned pie chart
const Plannedimage = await piePlanned.renderToBuffer(piePlannedConfig);
//the image for the planned pie chart
const piePlannedImage = new AttachmentBuilder(Plannedimage, { name: 'plannedPieChart.png' });

//the buffer for the actual pie chart
const Actualimage = await pieActual.renderToBuffer(pieActualConfig);
//the image for the actual pie chart
const pieActualImage = new AttachmentBuilder(Actualimage, { name: 'actualPieChart.png' });