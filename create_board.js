/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create board based on the number parameter
export function createBoard(
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
      cellDiv.addEventListener("click", cellClick);
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
