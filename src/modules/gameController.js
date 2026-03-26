import Gameboard from './gameBoard.js';
import Player from './player.js';
import Ship from './ship.js';

// FIX: Use getter functions instead of exporting primitives at module load time.
// Exporting `playerOne` directly captures `undefined` (before initGame runs).
// Callers must use getPlayerOne() / getPlayerTwo() to always get current value.

let playerOne;
let playerTwo;
let currentPlayer;

let placingShips = true;
const shipsToPlace = [5, 4, 3, 3, 2];
const shipNames   = ['Carrier', 'Battleship', 'Submarine', 'Cruiser', 'Destroyer'];
let currentShipIndex = 0;

// FIX: currentDirection needs a setter so dom.js can wire the toggle
let currentDirection = 'H';

function setDirection(dir) {
  currentDirection = dir;
}

function getDirection() {
  return currentDirection;
}

// FIX: export getter functions so dom.js always gets live references
function getPlayerOne() { return playerOne; }
function getPlayerTwo() { return playerTwo; }

function getCurrentShipLength() {
  return shipsToPlace[currentShipIndex];
}

function getCurrentShipName() {
  return shipNames[currentShipIndex];
}

function getRemainingShips() {
  return shipNames.slice(currentShipIndex);
}

function isPlacingShips() {
  return placingShips;
}

// FIX: placeComputerShips was called but never defined
function placeComputerShips() {
  const lengths = [5, 4, 3, 3, 2];
  for (const length of lengths) {
    let placed = false;
    let attempts = 0;
    // BUG FIX: infinite loop guard — reset entire board if we get stuck
    // (extremely rare but prevents ships from being silently skipped,
    //  which caused allShipSunk() to trigger too early)
    while (!placed) {
      if (attempts > 200) {
        playerTwo.board = new (playerTwo.board.constructor)();
        placeComputerShips();
        return;
      }
      const dir = Math.random() < 0.5 ? 'H' : 'V';
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      try {
        playerTwo.board.placeShip(new Ship(length), [x, y], dir);
        placed = true;
      } catch {
        attempts++;
      }
    }
  }
}

function placeShipAt(x, y) {
  if (!placingShips) return false;

  const length = shipsToPlace[currentShipIndex];
  const ship = new Ship(length);

  try {
    playerOne.board.placeShip(ship, [x, y], currentDirection);
    currentShipIndex++;

    if (currentShipIndex === shipsToPlace.length) {
      placingShips = false;
      placeComputerShips();
    }
    return true;
  } catch {
    return false;
  }
}

function initGame() {
  playerOne = new Player(false);
  playerTwo = new Player(true);

  playerOne.board = new Gameboard();
  playerTwo.board = new Gameboard();

  currentPlayer = playerOne;
  placingShips = true;
  currentShipIndex = 0;
  currentDirection = 'H';
}

// Returns { winner: 'player'|'computer'|null }
function playerTurn(coord) {
  if (placingShips) return { winner: null };

  // FIX: only allow attacks when it's the human's turn
  if (currentPlayer !== playerOne) return { winner: null };

  playerOne.attack(playerTwo.board, coord);

  if (playerTwo.board.allShipSunk()) {
    return { winner: 'player' };
  }

  // Computer turn — FIX: was missing entirely, causing the broken computer turn
  currentPlayer = playerTwo;
  playerTwo.attack(playerOne.board);

  if (playerOne.board.allShipSunk()) {
    return { winner: 'computer' };
  }

  currentPlayer = playerOne;
  return { winner: null };
}

function isGameOver() {
  return playerOne.board.allShipSunk() || playerTwo.board.allShipSunk();
}

// dom.js uses this to find all board coords that belong to a given ship object
// so it can flash the sunk animation on every cell of that ship
function getSunkCoordsFor(board, ship) {
  const coords = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (board.board[i][j] === ship) coords.push([i, j]);
    }
  }
  return coords;
}

export {
  initGame,
  playerTurn,
  isGameOver,
  isPlacingShips,
  placeShipAt,
  setDirection,
  getDirection,
  getPlayerOne,
  getPlayerTwo,
  getCurrentShipLength,
  getCurrentShipName,
  getRemainingShips,
  getSunkCoordsFor,
};