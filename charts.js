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
    country: "Russia",
    textTranslate: {
      x: -15, y: -35
    },
    lineParameters: {
      "x2": 10, "y2": -28
    }
  },
  {
    name: "Ocheretino breakthrough",
    date: new Date(2024, 3, 21),
    country: "Russia",
    textTranslate: {
      x: 17, y: 8
    },
    lineParameters: {
      "x2": 16, "y2": 7
    }
  },
  {
    name: "Volchansk offensive",
    date: new Date(2024, 4, 10),
    country: "Russia",
    textTranslate: {
      x: 35, y: 0
    },
    lineParameters: {
      "x2": 33, "y2": 0
    }
  },
  {
    name: "New York offensive",
    date: new Date(2024, 6, 3),
    country: "Russia",
    textTranslate: {
      x: 30, y: 10
    },
    lineParameters: {
      "x2": 28, "y2": 9
    }
  },
  {
    name: "Kursk offensive",
    date: new Date(2024, 7, 6),
    country: "Ukraine",
    textTranslate: {
      x: 30, y: 10
    },
    lineParameters: {
      "x2": 28, "y2": 9
    }
  },
  {
    name: "Novogrodovka falls",
    date: new Date(2024, 7, 28),
    country: "Russia",
    textTranslate: {
      x: 30, y: 10
    },
    lineParameters: {
      "x2": 28, "y2": 9
    }
  },
  {
    name: "Nevelskoe and Krasnogorovka fall",
    date: new Date(2024, 8, 11),
    country: "Russia",
    textTranslate: {
      x: 30, y: 10
    },
    lineParameters: {
      "x2": 28, "y2": 9
    }
  },
  {
    name: "Ukrainsk falls",
    date: new Date(2024, 8, 24),
    country: "Russia",
    textTranslate: {
      x: 30, y: 10
    },
    lineParameters: {
      "x2": 28, "y2": 9
    }
  },
  {
    name: "Ugledar falls",
    date: new Date(2024, 9, 2),
    country: "Russia",
    textTranslate: {
      x: 30, y: 3
    },
    lineParameters: {
      "x2": 28, "y2": 3
    }
  },
  {
    name: "New York falls",
    date: new Date(2024, 9, 16),
    country: "Russia",
    textTranslate: {
      x: -85, y: -25
    },
    lineParameters: {
      "x2": -45, "y2": -18
    }
  },
  {
    name: "Selidovo and Gorniak fall",
    date: new Date(2024, 9, 30),
    country: "Russia",
    textTranslate: {
      x: 30, y: 3
    },
    lineParameters: {
      "x2": 28, "y2": 3
    }
  },
  {
    name: "Kurakhovo falls",
    date: new Date(2025, 0, 10),
    country: "Russia",
    textTranslate: {
      x: 30, y: 3
    },
    lineParameters: {
      "x2": 28, "y2": 3
    }
  },
  {
    name: "Velikaya Novosiolka falls",
    date: new Date(2025, 0, 29),
    country: "Russia",
    textTranslate: {
      x: -100, y: -25
    },
    lineParameters: {
      "x2": -45, "y2": -18
    }
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
    .tickFormat(d3.timeFormat("%b %y"))
    .tickSizeOuter(0);

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

  // Drawing circles and adding labels and lines to them
  const circlesAndLabels = innerChart
    .selectAll("g.important-event")
    .data(importantEvents)
    .join("g")
      .attr("class", "important-event")
      .attr("transform", d => `translate(${xScale(d.date)}, ${yScale(data.find(datum => datum.date.getFullYear() === d.date.getFullYear() && datum.date.getMonth() === d.date.getMonth() && datum.date.getDate() === d.date.getDate()).yearLoss)})`)
  
  circlesAndLabels
    .append("circle")
      .attr("r", 3)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("fill", d => d.country === "Russia" ? "red" : "lime");

  circlesAndLabels
    .append("text")
      .attr("class", "important-event-text")
      .attr("transform", d => {
        if (d.textTranslate) {
          return `translate(${d.textTranslate.x}, ${d.textTranslate.y})`;
        }
      })
      .attr("dominant-baseline", "middle")
      .text(d => d.name);

  circlesAndLabels
    .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", d => d.lineParameters ? d.lineParameters.x2 : 50
      )
      .attr("y2", d => d.lineParameters ? d.lineParameters.y2 : 50)
      .attr("stroke", d => d.country === "Russia" ? "red" : "lime")
      .attr("stroke-width", 1);
}