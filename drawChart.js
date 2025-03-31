"use strict";

d3.dsv(";", "dailyStats.csv", function(d) {
  if (d.year_value) {
    const splitted = d.date.split(".");

    const day = Number(splitted[0]);
    const month = Number(splitted[1]) - 1;
    const year = Number(splitted[2]);
    const date = new Date(year, month, day);

    const dayChange = Number(d.day_value.replace(",", "."));
    const yearChange = Number(d.year_value.replace(",", "."));
        
    return {
      date,
      dayLoss: -dayChange,
      yearLoss: -yearChange
    };
  }
}).then(data => drawChart(data));

// Important events to be represented with circles on the chart
const importantEvents = [
  {
    name: "Avdiivka falls",
    date: new Date(2024, 1, 17),
    country: "Russia"
  },
  {
    name: "Ocheretino breakthrough",
    date: new Date(2024, 3, 21),
    country: "Russia"
  },
  {
    name: "Volchansk offensive",
    date: new Date(2024, 4, 10),
    country: "Russia"
  },
  {
    name: "New York offensive",
    date: new Date(2024, 6, 3),
    country: "Russia"
  },
  {
    name: "Kursk offensive",
    date: new Date(2024, 7, 6),
    country: "Ukraine"
  },
  {
    name: "Novogrodovka falls",
    date: new Date(2024, 7, 28),
    country: "Russia"
  },
  {
    name: "Nevelskoe and Krasnogorovka fall",
    date: new Date(2024, 8, 11),
    country: "Russia"
  },
  {
    name: "Ukrainsk falls",
    date: new Date(2024, 8, 24),
    country: "Russia"
  },
  {
    name: "Ugledar falls",
    date: new Date(2024, 9, 2),
    country: "Russia"
  },
  {
    name: "New York falls",
    date: new Date(2024, 9, 16),
    country: "Russia"
  }
];

function drawChart(data) {
  // Setting up the dimensions of the SVG container
  const width = 900;
  const innerWidth = width - 70;
  const height = 500;
  const innerHeight = height - 50;

  // Creating an SVG element inside the body of the HTML
  const svg = d3.select(".charts-container")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);
  
  const innerChart = svg
    .append("g")
      .attr("transform", "translate(50, 20)");

  // Calculating the maximum and minimum domain values
  const firstDate = d3.min(data, d => d.date);
  const lastDate = d3.max(data, d => d.date);
  const maxYearValue = d3.max(data, d => d.yearLoss);
  const maxDomainYearValue = Math.ceil(maxYearValue / 500) * 500;

  // Defining the scale for the X and Y axes
  const xScale = d3.scaleTime()
    .domain([firstDate, lastDate])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, maxDomainYearValue])
    .range([innerHeight, 0]);

  // Adding X and Y axes
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.timeFormat("%b %y"));

  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(d3.range(0, maxDomainYearValue + 1, 250));

  innerChart
    .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

  innerChart
    .append("g")
      .attr("class", "axis-y")
      .call(yAxis);

  // Extending horizontal ticks
  d3.selectAll(".axis-y .tick")
    .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", innerWidth)
      .attr("y2", 0)
      .attr("stroke", "rgba(255, 255, 255, 0.8)")
      .attr("stroke-width", 0.3);

  // Adding line generator
  const lineGenerator = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.yearLoss))
    .curve(d3.curveBasis); // Make the line smooth

  innerChart
    .append("path")
      .attr("d", lineGenerator(data))
      .attr("fill", "none")
      .attr("stroke", "lightcoral")
      .attr("stroke-width", "2");

  // Drawing circles
  innerChart
    .selectAll("circle")
    .data(importantEvents)
    .join("circle")
      .attr("r", 3)
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => 
        yScale(data.find(datum => datum.date.getFullYear() === d.date.getFullYear() && datum.date.getMonth() === d.date.getMonth() && datum.date.getDate() === d.date.getDate()).yearLoss)
      )
      .attr("fill", d => d.country === "Russia" ? "red" : "lime");
}