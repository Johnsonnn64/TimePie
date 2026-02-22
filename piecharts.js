require("dotenv").config();

//setup for both the pie charts
const pieChartPlanned = new ChartJSNodeCanvas({width: 250, height: 250}); //pixel x pixel size
const pieChartActual = new ChartJSNodeCanvas({width: 250, height: 250}); //pixel x pixel size

//configuration for the planned pie chart
const piePlannedConfig = {
  type: 'pie',
  data: {
    labels: ['Apples', 'Bananas', 'Cherries', 'Dates'],
    datasets: [{
        data: [15, 30, 45, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33'],
    }]
  }
};

//configuration for the actual pie chart
const pieActualConfig = {
  type: 'pie',
  data: {
    labels: ['Apples', 'Bananas', 'Cherries', 'Dates'],
    datasets: [{
        data: [15, 30, 45, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8AFF33'],
    }]
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