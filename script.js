let newGame = document.getElementById("new-game");
const gridElement = document.querySelector(".grid");
const gridColumns = 10;
const gridRows = 10;
const cells = [];
const h1 = document.querySelector("h1");
const startScreen = document.querySelector(".start-screen")
let num = 0;
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
  createTheGrid();
  createShips();
}
//function creates grid, its invoked in function: startNewGame
function createTheGrid() {
  for (let i = 0; i < gridColumns * gridRows; i++) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = i;
    gridElement.append(div);
    div.textContent = i;
    cells.push(div);
  }
}

let currentStep = "start";
function nextStep() {
  switch (currentStep) {
    case "start":
      newGame.textContent = "Save ships";
      startNewGame();
      h1.innerHTML = "Player 1: Place your ships";
      currentStep = "placement";
      break;
    case "placement":
      h1.innerHTML = "KILL THE COMPUTER";
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

    // for (let j = 0; j < ship.length; j++) {
    // const index = j * gridColumns + i;
    // const cell = cells[index];
    // ship.cells.push(cell);
    // }
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

      num += 1;
      if (num === 17) {
        emptyGrid();
        alert("PLAYER WON");
      }
      //alert("found ship");
    } else {
      clickedCell.classList.add("missed-hit");
      missedHit += 1;
      if (missedHit == 2) {
        emptyGrid();
        alert("YOU LOSE");
      }
      //alert("you suck");
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

function loadStartScreen (){
  window.addEventListener('load', () => {
  })
}
