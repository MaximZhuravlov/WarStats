"use strict";

const yearTables = [...document.querySelectorAll(".year-table")];
yearTables.forEach(table => {
  calculateChange(table);
  calculateSum(table);
});

const monthTables = [...document.querySelectorAll(".month-table")];
monthTables.forEach(table => {
  generateDates(table);
  calculateChange(table);
  calculateSum(table);
  calculatePercentage(table);
  setColor(table);
});

function generateDates(table) {
  const month = table.dataset.month;
  const year = table.dataset.year;

  [...table.querySelectorAll("tbody .date")]
  .forEach((item, index) => item.textContent = index <= 8 ? `0${index + 1}.${month}.${year}` : `${index + 1}.${month}.${year}`);
}

function calculateChange(table) {
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach(row => {
    const occupied = 
      Number(row.querySelector(".occupied").textContent.replace(",", "."));
    const liberated = 
      Number(row.querySelector(".liberated").textContent.replace(",", "."));
    const change = liberated - occupied;
    row.querySelector(".change").textContent = 
      change > 0
        ? "+" + change.toFixed(2).replace(".", ",")
        : change.toFixed(2).replace(".", ",");
  });
}

function calculateSum(table) {
  const tFoot = table.querySelector("tfoot");

  const liberatedTotal = 
    [...table.querySelectorAll(".liberated")]
    .map(cell => cell.textContent)
    .map(element => Number(element.replace(",", ".")))
    .reduce((sum, current) => sum + current);

  const occupiedTotal = 
    [...table.querySelectorAll(".occupied")]
    .map(cell => cell.textContent)
    .map(element => Number(element.replace(",", ".")))
    .reduce((sum, current) => sum + current);

  const changeTotal = liberatedTotal - occupiedTotal;

  tFoot.querySelector(".liberated").textContent = 
    liberatedTotal.toFixed(2).replace(".", ",");

  tFoot.querySelector(".occupied").textContent = 
    occupiedTotal.toFixed(2).replace(".", ",");
    
  tFoot.querySelector(".change").textContent = 
    changeTotal > 0
      ? "+" + changeTotal.toFixed(2).replace(".", ",")
      : changeTotal.toFixed(2).replace(".", ",");
}

function calculatePercentage(table) {
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach(row => {
    // format the cell with whitespace as thousands separator
    const totalCell = row.querySelector(".total-occupied");
    const totalValue = Number(totalCell.textContent);
    totalCell.textContent = totalValue.toLocaleString().replaceAll(",", " ");

    // calculate the percentage
    const landArea = 579_330; // Ukraine's land area according to CIA
    const percentage = totalValue / landArea * 100;
    row.querySelector(".total-occupied-percentage").textContent = percentage.toFixed(5) + "%";
  });
}

function setColor(table) {
  // set color for liberated cells
  const liberatedCells = table.querySelectorAll("tbody .liberated");
  for (let i = 0; i < liberatedCells.length; i++) {
    const cellValue = Number(liberatedCells[i].textContent.replace(",", "."));
    
    if (cellValue >= 10) {
      liberatedCells[i].classList.add("significant-gain");
    }

    if (cellValue > 5 && cellValue < 10) {
      liberatedCells[i].classList.add("insignificant-gain");
    }

    if (cellValue <= 5) {
      liberatedCells[i].classList.add("stable");
    }
  }
  
  // set color for occupied cells
  const occupiedCells = table.querySelectorAll("tbody .occupied");
  for (let i = 0; i < occupiedCells.length; i++) {
    const cellValue = Number(occupiedCells[i].textContent.replace(",", "."));

    if (cellValue >= 10) {
      occupiedCells[i].classList.add("significant-loss");
    }

    if (cellValue > 5 && cellValue < 10) {
      occupiedCells[i].classList.add("insignificant-loss");
    }

    if (cellValue <= 5) {
      occupiedCells[i].classList.add("stable");
    }
  }

  // set color for change cells
  const changeCells = table.querySelectorAll("tbody .change");
  for (let i = 0; i < changeCells.length; i++) {
    const cellValue = Number(changeCells[i].textContent.replace(",", "."));

    if (cellValue >= 10) {
      changeCells[i].classList.add("significant-gain");
    }

    if (cellValue > 5 && cellValue < 10) {
      changeCells[i].classList.add("insignificant-gain");
    }

    if (cellValue >= -5 && cellValue <= 5) {
      changeCells[i].classList.add("stable");
    }

    if (cellValue < -5 && cellValue > -10) {
      changeCells[i].classList.add("insignificant-loss");
    }

    if (cellValue <= -10) {
      changeCells[i].classList.add("significant-loss");
    }
  }

  // set color for foot liberated cell
  const footLiberatedCell = table.querySelector("tfoot .liberated");
  const footLiberatedCellValue = Number(footLiberatedCell.textContent.replace(",", "."));

  if (footLiberatedCellValue >= 150) {
    footLiberatedCell.classList.add("significant-gain");
  }

  if (footLiberatedCellValue > 50 && footLiberatedCellValue < 150) {
    footLiberatedCell.classList.add("insignificant-gain");
  }

  if (footLiberatedCellValue <= 50) {
    footLiberatedCell.classList.add("stable");
  }

  // set color for foot occupied cell
  const footOccupiedCell = table.querySelector("tfoot .occupied");
  const footOccupiedCellValue = Number(footOccupiedCell.textContent.replace(",", "."));

  if (footOccupiedCellValue >= 150) {
    footOccupiedCell.classList.add("significant-loss");
  }

  if (footOccupiedCellValue > 50 && footOccupiedCellValue < 150) {
    footOccupiedCell.classList.add("insignificant-loss");
  }

  if (footOccupiedCellValue <= 50) {
    footOccupiedCell.classList.add("stable");
  }

  // set color for foot change cell
  const footChangeCell = table.querySelector("tfoot .change");
  const footChangeCellValue = Number(footChangeCell.textContent.replace(",", "."));

  if (footChangeCellValue >= 150) {
    footChangeCell.classList.add("significant-gain");
  }

  if (footChangeCellValue > 50 && footChangeCellValue < 150) {
    footChangeCell.classList.add("insignificant-gain");
  }

  if (footChangeCellValue >= -50 && footChangeCellValue <= 50) {
    footChangeCell.classList.add("stable");
  }

  if (footChangeCellValue < -50 && footChangeCellValue > -150) {
    footChangeCell.classList.add("insignificant-loss");
  }

  if (footChangeCellValue <= -150) {
    footChangeCell.classList.add("significant-loss");
  }
}