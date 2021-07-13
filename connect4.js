// Connect Four

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1;   // active player: 1 or 2
const board = [];     // array of rows, each row is array of cells  (board[y][x])


// makeBoard: create in-JS board structure:
// board = array of rows, each row is array of cells  (board[y][x])
function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    board.push([]);
    for (let j = 0; j < WIDTH; j++) {
      board[i].push(null)
    }
  }
}

// makeHtmlBoard: make HTML table and row of column tops.
function makeHtmlBoard() {

  const htmlBoard = document.querySelector('#board');   // get "htmlBoard" element from HTML
  const top = document.createElement('tr');             // create top row of  board
  top.setAttribute('id', 'column-top');                 // set top row id to "column-top"
  top.addEventListener('click', handleClick);           // add click listener to top row

  // create cells for top row, iterating over columns in row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');      // create a table cell element for top row
    headCell.setAttribute('id', x);                     // set each cell's id number from 0 to (WIDTH -1)
    top.append(headCell);                               // append cell to top row
  }

  htmlBoard.append(top);

  // create the table cell element for all subsequent rows
  // first looping over HEIGHT
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');     // creating row elements for each

    // then looping through each row to create cell elements according to WIDTH
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');  // creating cell elements for the current row
      cell.setAttribute('id', `${x}-${y}`);       // setting cell id to describe its position: "row position"-"column position"
      row.append(cell);                           // appending the cell to the row
    }
    htmlBoard.append(row);                        // appending the row to the board

  }
}



// handleClick: handle click of column top to play piece 

function handleClick(evt) {

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table  
  placeInTable(y, x);
  board[y][x] = currPlayer;


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} has won!`);
  }

  // check for tie
  checkIsTie()

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

function checkIsTie() {
  return board.flat().every(function (val) {
    val !== null;
  })
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) {
      return i;
    }
  }
  return null;
}

// placeInTable: update DOM to place piece into HTML table of board 

function placeInTable(y, x) {
  const cell = document.getElementById(`${x}-${y}`);
  const piece = document.createElement('div');              // create piece div
  piece.setAttribute('class', `piece p${currPlayer}`);    // setting its class to "piece" and to match the current player ("p1" or "p2")
  cell.append(piece);                                     // appending the div to the current cell
}


// checkForWin: check board cell-by-cell for "does a win start here?"

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // are all four cells valid and set to the current player?
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // looking for a win over each cell according to position in matrix
  // along vertical, horizontal, and diagonal lines
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if any one of these return true endGame is run
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout( () => {
    const winBadge = document.querySelector('#game-over');
    const winMsg = document.querySelector('#state-winner');
    winBadge.style.display = 'flex';
    winMsg.innerText = `Player ${currPlayer} has won!`
  }, 400)
  const carZoom = document.querySelector('#toyota');
  carZoom.classList.add('zoom')
}

makeBoard();
makeHtmlBoard();
