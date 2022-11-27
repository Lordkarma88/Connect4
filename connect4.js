/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
let end = false;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])*/
function makeBoard() {
  // Iterate through height and push empty array for each row
  for (y = 0; y < HEIGHT; y++) {
    board.push([]);
    // Iterate through width and push null for each column
    for (x = 0; x < WIDTH; x++) {
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // Create top row to click on
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create head for each column
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("th");
    // Set id to x position
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create row for each x pos
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    // Add WIDTH cells in each rows
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      // Set cell id to "x-y"
      cell.setAttribute("id", `${x}-${y}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = 5; y > -1; y--) {
    if (board[y][x] === null) return y;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(x, y) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.className = `piece p${currPlayer}`;
  document.getElementById(`${x}-${y}`).append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // Timeout leaves time for token to appear
  setTimeout(() => {
    alert(msg);
  }, 500);
  // Set to true to prevent anymore changes
  end = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell ("+" turns str into num)
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null || end) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(x, y);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    const winner = currPlayer == 1 ? "Pacman" : "Ghost";
    return endGame(`Player ${winner} won!`);
  }

  // check for tie
  if (checkForTie()) {
    return endGame(`Tis a tie!`);
  }

  // switch players
  currPlayer = currPlayer == 1 ? 2 : 1;
}

// Returns true if every cell does NOT have null
function checkForTie() {
  return board.every((row) => row.every((cell) => cell !== null));
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Iterates through the whole board array
  // Takes each row first
  for (let y = 0; y < HEIGHT; y++) {
    // Iterates through every cell of that row
    for (let x = 0; x < WIDTH; x++) {
      // Makes 4 arrays based on that cell
      // One horizontal, going left
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      // One vertical, going up
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      // One diagonal, going up and left
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      // Another diag, going up and right
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      // Any other combination isn't needed as it will get made using the other cells

      // If any of those are valid and have the same player, it's a win
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
