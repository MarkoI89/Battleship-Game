let newGame = document.getElementById("new-game");
const gridElement = document.querySelector(".grid");
const gridColumns = 10;
const gridRows = 10;
const cells = [];
const h1 = document.querySelector("h1");

const ships = [
  {
    name: "destroyer",
    length: 2,
    name: "submarine",
    length: 3,
    name: "cruiser",
    length: 3,
    name: "battleship",
    length: 4,
    name: "carrier",
    length: 5,
  },
];

function startNewGame() {
  createTheGrid();
  createShips();
}

function createTheGrid() {
  for (let i = 0; i < gridColumns * gridRows; i++) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.index = i;
    gridElement.append(div);
    cells.push(div);
  }
}
newGame.addEventListener("click", () => {
  newGame.textContent = "Next player";
  startNewGame();
  h1.innerHTML = "Player 1: Place your ships";
});

function createShips() {
  const shipLengths = [2, 3, 3, 4, 5];
  for (let i = 0; i < 5; i++) {
    const currentShip = shipLengths[i];
    for (let j = 0; j < currentShip; j++) {
      const index = `${9 - j}${i}`;
      const cell = cells[index];
      cell.classList.add("ship");
      console.log(cell);
    }
  }
}

