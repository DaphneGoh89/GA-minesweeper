//import JSConfetti from "js-confetti";

const JSConfetti = window.JSConfetti;

// game constants
const gameArea = document.getElementById("game-area");
const board = document.getElementById("board");
const bombCount = document.getElementById("bomb-count");
const smiley = document.getElementById("smiley");
const countDown = document.getElementById("count-down");
const startGame = document.getElementById("start-game");
const resetGame = document.getElementById("reset-game");

const gameDifficulty = {
  easy: {
    row: 10,
    col: 10,
    numOfBomb: 15,
    boardWidth: "450px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 179, // time in seconds
  },
  medium: {
    row: 16,
    col: 16,
    numOfBomb: 40,
    boardWidth: "450px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 299,
  },
  hard: {
    row: 20,
    col: 20,
    numOfBomb: 70,
    boardWidth: "550px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 359,
  },
  adventurous: {
    row: 20,
    col: 40,
    numOfBomb: 120,
    boardWidth: "1000px",
    cellWidth: "30px",
    borderWidth: "3px",
    timeInSecond: 599,
  },
};

const numberColor = {
  1: "blue",
  2: "green",
  3: "red",
  4: "darkblue",
  5: "brown",
  6: "darkcyan",
  7: "black",
  8: "grey",
};

// game parameters declaration
let rowNum;
let colNum;
let numOfBomb;
let boardWidth;
let cellWidth;
let borderWidth;
let timeInSecond;
let gameInterval;

// start game
window.addEventListener("DOMContentLoaded", () => {
  // listen to start game button
  startGame.addEventListener("click", (e) => {
    e.preventDefault();

    // get game parameters: difficulty level and timer setup
    const difficulty = document.querySelector(
      "input[name='difficulty']:checked"
    ).value;

    rowNum = gameDifficulty[difficulty].row;
    colNum = gameDifficulty[difficulty].col;
    numOfBomb = gameDifficulty[difficulty].numOfBomb;
    boardWidth = gameDifficulty[difficulty].boardWidth;
    cellWidth = gameDifficulty[difficulty].cellWidth;
    borderWidth = gameDifficulty[difficulty].borderWidth;

    if (document.getElementById("timer").checked) {
      timeInSecond = gameDifficulty[difficulty].timeInSecond;
    } else {
      timeInSecond = 0;
    }

    // reset game
    board.innerHTML = "";
    smiley.innerHTML = "<i class='fa-regular fa-face-smile fa-2x'></i>";

    // game setup
    gameInterval = setInterval(updateTimer, 1000);
    bombCount.innerHTML = ("000" + numOfBomb).substr(-3);
    const gameArray = createGameArray();
    createBoard(gameArray);

    // disable change in game parameters
    startGame.disabled = true;
    document.getElementById("timer").disabled = true;
    document.getElementsByName("difficulty").disabled = true;

    // pauseGame.addEventListener("click", (e) => {
    //   stopTimer();
    //   //e.stopPropagation();
    // });
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. Update timer:
// (a) Timer's on: countdown from allocated game time
// (b) Timer's off: count up to time taken to complete game
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateTimer() {
  let minutes = ("00" + Math.floor(timeInSecond / 60)).substr(-2);
  let seconds = ("00" + (timeInSecond % 60)).substr(-2);

  if (document.getElementById("timer").checked) {
    if (timeInSecond > 0) {
      timeInSecond--;
    } else {
      endGame();
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
        e.preventDefault();
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
  if (div.classList.contains("bomb")) {
    // 1. show bomb
    div.innerHTML = "<i class='fa-solid fa-bomb'></i>";
    div.style.backgroundColor = "red";
    // 2. end game --> reveal all cells, disable all cell click events
    div.dataset.status = "revealed";
    endGame(div);
  } else if (div.dataset.status !== "hidden") return;
  else {
    div.dataset.status = "revealed";
    // calculate number of bombs in adjacent cells
    const adjacentCells = getAdjacentCells(div);
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
      div.style.color = numberColor[surroundingBombs];
    }
  }
  checkWin();
}

function repeatCellClick(div) {
  cellClick(div);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4. Add event listener function
// (b) cellFlag
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// right click to flag cell
// if empty --> place flag in cell --> add flagged class to classlist --> change data-status to flagged --> decrease bombcount
// if not empty --> empty content --> remove flagged class --> revert data-status to hidden --> increment bombcount

function cellFlag(e) {
  e.preventDefault();
  let targetDiv = e.target;
  // console.log({ targetDiv });

  if (targetDiv.tagName === "DIV" && targetDiv.childNodes.length === 0) {
    // add flag icon into flagged div
    targetDiv.innerHTML = "<i class='fa-solid fa-flag'></i>";
    targetDiv.classList.add("flagged");
    targetDiv.dataset.status = "flagged";
    // decrement bombcount by number of flags established
    let newBombCount = parseInt(bombCount.innerHTML) - 1;
    bombCount.innerHTML = ("000" + newBombCount).substr(-3);
  } else {
    targetDiv.parentNode.classList.remove("flagged");
    targetDiv.parentNode.dataset.status = "hidden";
    targetDiv.remove();
    let newBombCount = parseInt(bombCount.innerHTML) + 1;
    bombCount.innerHTML = ("000" + newBombCount).substr(-3);
  }
  checkWin();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 5. End game
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function endGame(div) {
  // 1. display a crying face in smiley
  smiley.innerHTML = "<i class='fa-regular fa-face-sad-tear fa-2x'></i>";
  smiley.style.color = "red";
  // 2. reveal all bomb tiles
  const hiddenCells = document.querySelectorAll("[data-status='hidden']");
  for (let cell of hiddenCells) {
    if (cell.classList.contains("bomb")) {
      revealBomb(cell);
    }
    cell.style["pointer-events"] = "none";
  }

  stopTimer();
  startGame.disabled = false;
}

function revealBomb(cell) {
  if (cell.innerHTML === "") {
    cell.innerHTML = "<i class='fa-solid fa-bomb'></i>";
  }
  cell.style.backgroundColor = "orange";
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 6. Stop timer
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function stopTimer() {
  clearInterval(gameInterval);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 7. Check win
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkWin() {
  const flaggedCells = JSON.stringify(
    document.querySelectorAll("[data-status='flagged']")
  );
  const bombCells = JSON.stringify(document.querySelectorAll(".bomb"));

  // win logic
  if (
    document.querySelectorAll("[data-status = 'flagged'].bomb").length ===
    numOfBomb
  ) {
    winAction();
  }
}

function winAction() {
  stopTimer();
  rainConfetti();
  startGame.disabled = false;
  document.getElementById("timer").disabled = false;
  for (let cell of document.querySelectorAll(".bomb")) {
    revealBomb(cell);
  }

  // reveal all bomb locations
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Confetti Anime
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const jsConfetti = new JSConfetti();
function rainConfetti() {
  jsConfetti.addConfetti({ confettiNumber: 1000 });
}
