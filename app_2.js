// game constants
const gameArea = document.getElementById("game-area");
const board = document.getElementById("board");
const bombCount = document.getElementById("bomb-count");
const smiley = document.getElementById("smiley");
const countDown = document.getElementById("count-down");
const startGame = document.getElementById("start-game");

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
    row: 30,
    col: 40,
    numOfBomb: 360,
    boardWidth: "900px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 599,
  },
};

// get game parameters: difficulty level and timer setup
const difficulty = document.querySelector(
  "input[name='difficulty']:checked"
).value;

const setTimer = () => {
  if (document.getElementById("timer").checked) {
    return "Y";
  } else {
    return "N";
  }
};

// game parameters declaration
let rowNum;
let colNum;
let numOfBomb;
let boardWidth;
let cellWidth;
let borderWidth;
let timeInSecond;

// start game
window.addEventListener("DOMContentLoaded", () => {
  // listen to start game button
  startGame.addEventListener("click", (e) => {
    e.preventDefault();

    rowNum = gameDifficulty[difficulty].row;
    colNum = gameDifficulty[difficulty].col;
    numOfBomb = gameDifficulty[difficulty].numOfBomb;
    boardWidth = gameDifficulty[difficulty].boardWidth;
    cellWidth = gameDifficulty[difficulty].cellWidth;
    borderWidth = gameDifficulty[difficulty].borderWidth;

    if (setTimer() === "Y") {
      timeInSecond = gameDifficulty[difficulty].timeInSecond;
    } else {
      timeInSecond = 0;
    }

    // game setup
    setInterval(updateTimer, 1000);
    bombCount.innerHTML = ("000" + numOfBomb).substr(-3);
    const gameArray = createGameArray();
    createBoard(gameArray);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. Update timer:
// (a) Timer's on: countdown from allocated game time
// (b) Timer's off: count up to time taken to complete game
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateTimer(char) {
  let minutes = ("00" + Math.floor(timeInSecond / 60)).substr(-2);
  let seconds = ("00" + (timeInSecond % 60)).substr(-2);

  if (setTimer() === "Y") {
    if (timeInSecond >= 0) {
      timeInSecond--;
    }
  } else {
    timeInSecond++;
  }
  countDown.innerHTML = `${minutes}:${seconds}`;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. Create game array
// (a) Create bomb array and normal array
// (b) Concatenate both arrays and randomize them
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createGameArray() {
  const bombArray = new Array(numOfBomb).fill("bomb");
  const normalArray = new Array(rowNum * colNum - numOfBomb).fill("normal");
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
// 3. Create game board
// (a) create board
// (b) create cell and assign attributes
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createBoard(gameArray) {
  gameArea.style.width = boardWidth;

  // (i) create board grid
  for (let x = 0; x < rowNum; x++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for (let y = 0; y < colNum; y++) {
      const cellDiv = createCell(x, y, gameArray.shift());
      rowDiv.append(cellDiv);

      // (a) add "left-click" event listener to cell
      cellDiv.addEventListener("click", (e) => {
        cellClick(e.target);
      });

      // (b) add "right-click" event listener to cell
      cellDiv.addEventListener("contextmenu", cellFlag);
    }
    board.append(rowDiv);
  }
}

// create div for individual cell
function createCell(x, y, bombClass) {
  const cellDiv = document.createElement("div");
  cellDiv.classList.add("grid-cell", `${bombClass}`);
  cellDiv.dataset.status = "hidden";
  cellDiv.dataset.x = x;
  cellDiv.dataset.y = y;
  cellDiv.style.width = cellWidth;
  cellDiv.style.borderWidth = borderWidth;
  return cellDiv;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4. Add event listener function
// (a) cellClick
//     - getAdjacentCells fx
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getAdjacentCells(div) {
  let x = div.dataset.x;
  let y = div.dataset.y;
  const adjacentCells = [];
  // this will loop through all the neighbouring cell of the targeted coordinates
  for (let XOffset = -1; XOffset <= 1; XOffset++) {
    for (let YOffset = -1; YOffset <= 1; YOffset++) {
      let xCoordinate = parseInt(x) + XOffset;
      let yCoordinate = parseInt(y) + YOffset;
      // both x- and y-coordinate cannot be negative value and cannot go beyond row/ column length
      if (
        xCoordinate >= 0 &&
        yCoordinate >= 0 &&
        xCoordinate < rowNum &&
        yCoordinate < colNum
      ) {
        // select neigbouring divs
        const adjacentDiv = document.querySelector(
          `[data-x="${xCoordinate}"][data-y="${yCoordinate}"]`
        );
        adjacentCells.push(adjacentDiv);
      }
    }
  }
  return adjacentCells;
}

/////// left-click event listener ///////
function cellClick(div) {
  if (div.classList.contains("bomb")) return;
  else if (div.dataset.status !== "hidden") return;
  else {
    div.dataset.status = "revealed";
    // calculate number of bombs in adjacent cells
    const adjacentCells = getAdjacentCells(div);
    console.log(adjacentCells);
    let surroundingBombs = 0;
    for (let cell of adjacentCells) {
      if (cell.classList.contains("bomb")) {
        surroundingBombs++;
      }
    }
    // decide next course of action based on number of surroundingBombs in clicked cell
    if (surroundingBombs === 0) {
      for (let cell of adjacentCells) {
        if (cell !== div) {
          repeatCellClick(cell);
        }
      }
    } else {
      div.innerHTML = surroundingBombs;
    }
  }
}

function repeatCellClick(div) {
  cellClick(div);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4. Add event listener function
// (b) cellFlag
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cellFlag(e) {
  e.preventDefault();
  const targetDiv = e.target;
  // add flag icon into flagged div
  targetDiv.innerHTML = "<i class='fa-solid fa-flag fa-2x'></i>";
  targetDiv.dataset.status = "flagged";
  // decrement bombcount by number of flags established
  let newBombCount = parseInt(bombCount.innerHTML) - 1;
  bombCount.innerHTML = ("000" + newBombCount).substr(-3);
}