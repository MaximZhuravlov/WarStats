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

function drawChart(data) {
}