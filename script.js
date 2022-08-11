let newGame = document.getElementById("new-game");
const gridElement = document.querySelector(".grid");
const gridColumns = 10;
const gridRows = 10;
let cells = [];
const h1 = document.querySelector("h1");
const startScreen = document.querySelector(".start-screen");
const divBox = document.createElement("div");
const shots = document.querySelector(".shots");
const missed = document.querySelector(".missed");
let num = 17;
let missedHit = 0;

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.cells = [];
    this.isSelectedForPlacement = false;
  }
  addCell(cell) {
    this.cells.push(cell);
  }
  display() {
    for (const cell of this.cells) {
      console.log(cell);
      cell.classList.add("ship", this.name);

      if (this.isSelectedForPlacement) {
        cell.classList.add("selected-for-placement");
      }
    }
  }
  hide() {
    for (const cell of this.cells) {
      cell.classList.remove("ship", this.name);

      if (this.isSelectedForPlacement) {
        cell.classList.remove("selected-for-placement");
      }
    }
  }

  selectForPlacement() {
    this.isSelectedForPlacement = true;
    // display that it is selected
    this.display();
  }
  cancelSelectForPlacement() {
    this.isSelectedForPlacement = false;
    this.display();
  }
  place(startCellIndex, direction) {
    const newCells = [];

    switch (direction) {
      case "across":
        if (startCellIndex % gridColumns > gridColumns - this.length) {
          console.log("invalid placement");
          return;
        }
        for (let i = 0; i < this.length; i++) {
          newCells.push(cells[startCellIndex + i]);
        }
        break;
      case "down":
        for (let i = 0; i < this.length; i++) {
          newCells.push(cells[startCellIndex + i * gridColumns]);
        }
        break;
    }

    this.hide();
    this.cells = newCells;

    this.cancelSelectForPlacement();
    this.display();
  }
}

const ships = [
  new Ship("destroyer", 2),
  new Ship("submarine", 3),
  new Ship("cruiser", 3),
  new Ship("battleship", 4),
  new Ship("carrier", 5),
];
//Function creates grid and ships
function startNewGame() {
  num = 17;
  missedHit = 0;
  shots.textContent = num;
  missed.textContent = missedHit;
  h1.innerHTML = "Place your ships";
  divBox.remove();
  createTheGrid();
  createShips();
  currentStep = "placement";
  num = 17;
}
//function creates grid, its invoked in function: startNewGame
function createTheGrid() {
  cells = [];
  for (let i = 0; i < gridColumns * gridRows; i++) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = i;
    gridElement.append(div);
    //div.textContent = i;
    cells.push(div);
  }
}

let currentStep = "start";
function nextStep() {
  switch (currentStep) {
    case "start":
      newGame.textContent = "Save ships";
      startNewGame();
      h1.innerHTML = "Place your ships";

      break;
    case "placement":
      h1.innerHTML = "Find ships";
      currentStep = "play";
      emptyGrid();
      break;
  }
}

//makes empty grid
function emptyGrid() {
  cells.forEach((cell) => {
    cell.className = "cell";
  });
}

newGame.addEventListener("click", () => {
  nextStep();
});
//function creates ships and display on default place
function createShips() {
  let i = 0;
  for (const ship of ships) {
    ship.place(i * 2 + i * gridColumns, i % 2 === 0 ? "down" : "across");

    //for (let j = 0; j < ship.length; j++) {
    //const index = j * gridColumns + i;
    //const cell = cells[index];
    //ship.cells.push(cell);
    //}
    i++;
  }
}

gridElement.addEventListener("click", (event) => {
  console.log(event.target);
  // check it is a cell
  const clickedCell = event.target;

  if (currentStep === "placement") {
    const foundShip = getSelectedShip();
    if (foundShip) {
      if (foundShip.cells.includes(clickedCell)) {
        foundShip.place(parseInt(clickedCell.dataset.index), "down");
      } else {
        foundShip.place(parseInt(clickedCell.dataset.index), "across");
      }
    } else {
      selectShipInClickedCell(clickedCell);
    }
  } else if (currentStep === "play") {
    const foundShip = getShipInCell(clickedCell);
    if (foundShip) {
      clickedCell.classList.add("hit");

      num -= 1;
      shots.textContent = num;
      if (num === 0) {
        emptyGrid();
        alertBoxWon();
      }
    } else {
      clickedCell.classList.add("missed-hit");
      missedHit += 1;
      missed.textContent = missedHit;
      if (missedHit == 20) {
        emptyGrid();
        alertBoxLost();
      }
    }
  }
});

function getShipInCell(cell) {
  let foundShip;
  for (const ship of ships) {
    if (ship.cells.includes(cell)) {
      console.log("Found !", ship);
      foundShip = ship;
      break;
    }
  }
  return foundShip;
}

function selectShipInClickedCell(clickedCell) {
  // find the ship in that cell
  const foundShip = getShipInCell(clickedCell);
  //const foundShip = ships[3];
  // if we find a ship, "activate" it (selectForPlacement)
  foundShip?.selectForPlacement();
}

function getSelectedShip() {
  const findShip = ships.find((ship) => ship.isSelectedForPlacement);
  return findShip;
}
function alertBoxLost() {
  gridElement.innerHTML = "";
  divBox.innerHTML = "";
  const main = document.querySelector("main");
  const restartGame = document.createElement("button");
  const p = document.createElement("p");
  p.textContent = "YOU SUUUUCK!!!";
  main.appendChild(divBox);
  divBox.appendChild(p);
  divBox.appendChild(restartGame);
  restartGame.classList.add("restart-game");
  restartGame.textContent = "START NEW GAME";
  restartGame.addEventListener("click", () => {
    startNewGame();
  });
  divBox.classList.add("alertBox");
}

function alertBoxWon() {
  gridElement.innerHTML = "";
  divBox.innerHTML = "";
  const main = document.querySelector("main");
  const restartGame = document.createElement("button");
  const p = document.createElement("p");
  p.textContent = "YOU WOOOON!!!";
  main.appendChild(divBox);
  divBox.appendChild(p);
  divBox.appendChild(restartGame);
  restartGame.classList.add("restart-game");
  restartGame.textContent = "START NEW GAME";
  restartGame.addEventListener("click", () => {
    startNewGame();
  });
  divBox.classList.add("alertBox");
}
