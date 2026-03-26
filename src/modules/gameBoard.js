export default class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.missedAttacks = [];
    this.attacked = new Set();
    this.ships = [];
  }

  placeShip(ship, [x, y], direction) {
    if (direction === 'H') {
      if (y + ship.length > 10) throw new Error('Out of bounds');
      for (let i = 0; i < ship.length; i++) {
        if (this.board[x][y + i] !== null) throw new Error('Overlap');
      }
      for (let i = 0; i < ship.length; i++) {
        this.board[x][y + i] = ship;
      }
    } else {
      if (x + ship.length > 10) throw new Error('Out of bounds');
      for (let i = 0; i < ship.length; i++) {
        if (this.board[x + i][y] !== null) throw new Error('Overlap');
      }
      for (let i = 0; i < ship.length; i++) {
        this.board[x + i][y] = ship;
      }
    }
    this.ships.push(ship);
  }

  receiveAttack([x, y]) {
    const key = `${x},${y}`;
    if (this.attacked.has(key)) return;
    this.attacked.add(key);

    const cell = this.board[x][y];
    if (cell === null) {
      this.missedAttacks.push([x, y]);
    } else {
      cell.hit();
    }
  }

  // Returns the ship object if the last attack just finished sinking it, else null.
  // Used by dom.js to trigger the sunk animation on all its cells.
  getLastSunkShip([x, y]) {
    const ship = this.board[x][y];
    if (ship && ship.isSunk()) return ship;
    return null;
  }

  // BUG FIX: was possible to have fewer ships registered if placeComputerShips
  // silently dropped a ship. Guard: must equal expected count (5).
  allShipSunk() {
    return this.ships.length > 0 && this.ships.every((ship) => ship.isSunk());
  }

  // How many ships are fully sunk right now
  sunkCount() {
    return this.ships.filter((s) => s.isSunk()).length;
  }
}