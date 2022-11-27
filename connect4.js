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
const players = [, "Pacman", "Ghost"]; // First value emtpy to simplify messages
const turn = document.querySelector("#turn");
let topRow; // To access later

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
  topRow = document.createElement("tr");
  topRow.setAttribute("id", "column-top");
  topRow.className = `${players[currPlayer]}`;
  topRow.addEventListener("click", handleClick);

  // Create head for each column
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("th");
    // Set id to x position
    headCell.setAttribute("id", x);
    topRow.append(headCell);
  }
  htmlBoard.append(topRow);

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

  // Add restart button with listener
  const restart = document.querySelector("#restart");
  restart.htmlBoard = htmlBoard;
  restart.addEventListener("click", restartGame);
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
  // Make a div and insert into correct table cell
  const piece = document.createElement("div");
  // Give it classname of "piece p1" or "piece p2"
  piece.className = `piece p${currPlayer}`;
  document.getElementById(`${x}-${y}`).append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  const winBanner = document.querySelector("#winBanner");
  // Timeout leaves time for token to appear
  setTimeout(() => {
    // alert(msg);
    // Make banner visible (css property)
    winBanner.classList.add("visible");
    winBanner.innerText = `🎊 ${msg} 🎊`;
    // Also add message in result div on the side
    document.querySelector("#result").innerText = msg;
  }, 500);
  setTimeout(() => {
    // Wait 1.5s from appearance and hide again
    winBanner.classList.remove("visible");
  }, 2000);
  // Set to true to prevent anymore changes
  end = true;
}

/** restartGame: resets board when buttons is clicked */
function restartGame(evt) {
  // Make winner start again
  let msg = `Player ${players[currPlayer]} starts!`;
  // Except if it was reset before a tie or a win
  if (!checkForTie() && !checkForWin()) {
    // In that case the player who didn't reset gets to start
    msg = `Player ${players[currPlayer]} reset!`;
    switchPlayers();
  }
  document.querySelector("#result").innerText = msg;

  // Clear board array
  for (let y = 0; y < HEIGHT; y++) board.pop();
  makeBoard();
  // Clear board table
  evt.currentTarget.htmlBoard.innerHTML = "";
  makeHtmlBoard();
  // Reset this too
  end = false;
}

/** switchPlayers: switches players and related info on screen */
function switchPlayers() {
  // Switch players
  currPlayer = currPlayer == 1 ? 2 : 1;
  // Change turn's text and class (color)
  turn.innerText = `${players[currPlayer]}'s turn`;
  turn.classList = `p${currPlayer}`;
  // Change topRow's class (bgimg)
  topRow.className = `${players[currPlayer]}`;
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
    return endGame(`Player ${players[currPlayer]} won!`);
  }

  // check for tie
  if (checkForTie()) {
    return endGame(`Tis a tie!`);
  }

  // Switch players
  switchPlayers();
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
