/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// game constants
const board = document.getElementById("board");
const gameArea = document.getElementById("game-area");
const startGame = document.getElementById("start-game");
const bombCount = document.getElementById("bomb-count");
const countDown = document.getElementById("count-down");
const gameDifficulty = {
  easy: {
    row: 8,
    col: 8,
    numOfBomb: 10,
    boardWidth: "450px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 179, // time in seconds
  },
  medium: {
    row: 10,
    col: 10,
    numOfBomb: 20,
    boardWidth: "450px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 299,
  },
  hard: {
    row: 16,
    col: 16,
    numOfBomb: 40,
    boardWidth: "450px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 359,
  },
  adventurous: {
    row: 40,
    col: 20,
    numOfBomb: 60,
    boardWidth: "450px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 599,
  },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// read game parameters
const difficulty = document.querySelector(
  "input[name='difficulty']:checked"
).value;

console.log(difficulty);

const setTimer = () => {
  if (document.getElementById("timer").checked) {
    return "Y";
  } else {
    return "N";
  }
};

console.log(setTimer());
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BOARD SETUP STARTS
// start game

let rowNum;
let colNum;
let numOfBomb;
let boardWidth;
let cellWidth;
let borderWidth;
let timeInSecond;

window.addEventListener("DOMContentLoaded", () => {
  startGame.addEventListener("click", (e) => {
    e.preventDefault();
    // 1. get game parameter and call the createGameArray / createBoard function
    rowNum = gameDifficulty[difficulty].row;
    colNum = gameDifficulty[difficulty].col;
    numOfBomb = gameDifficulty[difficulty].numOfBomb;
    boardWidth = gameDifficulty[difficulty].boardWidth;
    cellWidth = gameDifficulty[difficulty].cellWidth;
    borderWidth = gameDifficulty[difficulty].borderWidth;
    timeInSecond = gameDifficulty[difficulty].timeInSecond;
    // log parameters to console
    console.log(
      `${rowNum}, ${colNum}, ${numOfBomb}, ${boardWidth}, ${cellWidth}, ${borderWidth}, ${timeInSecond}`
    );

    // game setup
    setInterval(updateCountDown, 1000);
    const gameArray = createGameArray(numOfBomb, rowNum, colNum);
    createBoard(rowNum, colNum, boardWidth, cellWidth, borderWidth, gameArray);
    bombCount.innerHTML = ("000" + numOfBomb).substr(-3);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// timer countdown function
function updateCountDown() {
  let minutes = ("00" + Math.floor(timeInSecond / 60)).substr(-2);
  let seconds = ("00" + (timeInSecond % 60)).substr(-2);

  countDown.innerHTML = `${minutes}:${seconds}`;
  timeInSecond--;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create game array
function createGameArray(numOfBomb, row, col) {
  // initialize game and normal array
  const bombArray = new Array(numOfBomb).fill("bomb");
  const normalArray = new Array(row * col - numOfBomb).fill("normal");
  // concatenate both arrays into the game array and randomize them
  const gameArray = normalArray.concat(bombArray);
  const shuffledArray = shuffle(gameArray);
  console.log(shuffledArray);
  return shuffledArray;
}

// Fisher Yates (Knuth) Shuffle
function shuffle(arr) {
  let currentIndex = arr.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create board based on the number parameter
function createBoard(
  row = 10,
  col = 10,
  boardWidth,
  cellWidth,
  borderWidth,
  gameArray
) {
  // setting board width based on number of cells to be created
  gameArea.style.width = boardWidth;

  // create board grid
  for (let i = 0; i < row; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let j = 0; j < col; j++) {
      const cellDiv = createCell(i);
      cellDiv.style.width = cellWidth;
      cellDiv.style.borderWidth = borderWidth;
      // assign bomb class to cell based on gameArray
      cellDiv.classList.add(gameArray.shift());
      // this dataset will serve as the cell's coordinates
      cellDiv.dataset.x = i;
      cellDiv.dataset.y = j;
      // add event listener to each cell created
      cellDiv.addEventListener("click", (e) => {
        const targetDiv = e.target;
        let xCoordinate = targetDiv.dataset.x;
        let yCoordinate = targetDiv.dataset.y;
        cellClick(xCoordinate, yCoordinate);
      });
      // event listener to listen to right-click on cell div
      cellDiv.addEventListener("contextmenu", flagDiv);
      rowDiv.append(cellDiv);
    }
    board.append(rowDiv);
  }
}

// create div for individual cell
function createCell(num) {
  const cellDiv = document.createElement("div");
  cellDiv.classList.add("grid-cell");
  cellDiv.dataset.status = "hidden";
  return cellDiv;
}

// BOARD SETUP COMPLETED
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cellClick(x, y) {
  const targetDiv = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  console.log(targetDiv);
  // 1. cell contains bomb --> do nothing
  if (targetDiv.classList.contains("bomb")) return;
  else if ((targetDiv.dataset.status = "revealed")) return;
  // 2. if surrounding cell contains bomb --> reveal number of bombs
  else {
    // 1. get a list of coordinates of adjacent cells
    const adjacentCells = getAdjacentCells(x, y);
    // 2. count adjacent cells with bomb
    let adjacentCellsWBomb = 0;
    adjacentCells.forEach((arr) => {
      let xCoordinate = arr[0];
      let yCoordinate = arr[1];
      if (
        document
          .querySelector(`[data-x="${xCoordinate}"][data-y="${yCoordinate}"]`)
          .classList.contains("bomb")
      ) {
        adjacentCellsWBomb++;
      }
    });
    // 3. if none of the adjacent cells contains bomb --> loop through all adjacent cells and reveal those without
    // bombs

    if (adjacentCellsWBomb === 0) {
      adjacentCells.forEach(repeatClick);
    } else {
      targetDiv.innerHTML = adjacentCellsWBomb;
    }
    targetDiv.dataset.status = "revealed";
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function repeatClick(arr) {
  cellClick(arr[0], arr[1]);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function flagDiv(e) {
  e.preventDefault();
  const targetDiv = e.target;
  // add flag icon into flagged div
  targetDiv.innerHTML = "<i class='fa-solid fa-flag fa-2x'></i>";
  targetDiv.dataset.status = "flagged";
  // targetDiv.classList.add("flagged");
  // decrement bombcount by number of flags established
  let newBombCount = parseInt(bombCount.innerHTML) - 1;
  bombCount.innerHTML = ("000" + newBombCount).substr(-3);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getAdjacentCells(x, y) {
  const adjacentCells = [];
  // this will loop through all the neighbouring cell of the targeted coordinates
  for (let XOffset = -1; XOffset <= 1; XOffset++) {
    for (let YOffset = -1; YOffset <= 1; YOffset++) {
      let xCoordinate = parseInt(x) + XOffset;
      let yCoordinate = parseInt(y) + YOffset;
      // both x- and y-coordinate cannot be negative value
      if (
        xCoordinate >= 0 &&
        yCoordinate >= 0 &&
        xCoordinate < rowNum &&
        yCoordinate < colNum
      ) {
        const adjacentDiv = document.querySelector(
          `[data-x="${xCoordinate}"][data-y="${yCoordinate}"]`
        );
        adjacentCells.push([xCoordinate, yCoordinate]);
      }
    }
  }
  console.log(adjacentCells);
  return adjacentCells;
}
