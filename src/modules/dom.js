import {
  initGame,
  playerTurn,
  isGameOver,
  isPlacingShips,
  placeShipAt,
  setDirection,
  getDirection,
  getPlayerOne,
  getPlayerTwo,
  getCurrentShipName,
  getCurrentShipLength,
  getRemainingShips,
  getSunkCoordsFor,
} from './gameController.js';

// ─── Screen references ───────────────────────────────────────────────────────
const startScreen     = document.getElementById('start-screen');
const placementScreen = document.getElementById('placement-screen');
const gameScreen      = document.getElementById('game-screen');

// ─── Placement screen elements ───────────────────────────────────────────────
const placementGrid   = document.getElementById('placement-grid');
const directionBtn    = document.getElementById('direction-btn');
const shipQueueEl     = document.getElementById('ship-queue');
const shipNameEl      = document.getElementById('current-ship-name');
const placementMsg    = document.getElementById('placement-msg');

// ─── Game screen elements ────────────────────────────────────────────────────
const playerBoardEl   = document.getElementById('player-board');
const enemyBoardEl    = document.getElementById('enemy-board');
const statusEl        = document.getElementById('status');
const playerSunkEl    = document.getElementById('player-sunk-count');
const enemySunkEl     = document.getElementById('enemy-sunk-count');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function showScreen(screen) {
  [startScreen, placementScreen, gameScreen].forEach(s => s.style.display = 'none');
  screen.style.display = 'flex';
}

// ─── Render a 10×10 board into a container ───────────────────────────────────
function renderBoard(board, container, { isEnemy = false, disabled = false } = {}) {
  container.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = i;
      cell.dataset.y = j;

      const value = board.board[i][j];
      const key   = `${i},${j}`;
      const attacked = board.attacked.has(key);

      // Show player's own ships
      if (!isEnemy && value !== null) cell.classList.add('ship');

      // Show attack results
      if (attacked) {
        cell.classList.add(value === null ? 'miss' : 'hit');
      }

      // Enemy board: only unattacked cells are clickable during attack phase
      if (isEnemy && !disabled && !attacked) {
        cell.addEventListener('click', () => handleAttack(i, j));
      }

      container.appendChild(cell);
    }
  }
}

// ─── Placement grid ──────────────────────────────────────────────────────────
// FIX: placement clicks were wired to enemyBoard — should be its own grid
function renderPlacementGrid() {
  placementGrid.innerHTML = '';
  const playerOne = getPlayerOne();

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = i;
      cell.dataset.y = j;

      if (playerOne.board.board[i][j] !== null) {
        cell.classList.add('ship');
      }

      cell.addEventListener('mouseenter', () => showPreview(i, j));
      cell.addEventListener('mouseleave', clearPreview);
      cell.addEventListener('click', () => handlePlacement(i, j));

      placementGrid.appendChild(cell);
    }
  }
}

function showPreview(x, y) {
  clearPreview();
  if (!isPlacingShips()) return;

  const length = getCurrentShipLength();
  const dir    = getDirection();

  for (let i = 0; i < length; i++) {
    const px = dir === 'V' ? x + i : x;
    const py = dir === 'H' ? y + i : y;
    if (px >= 10 || py >= 10) break;

    const cell = placementGrid.querySelector(`[data-x="${px}"][data-y="${py}"]`);
    if (cell) cell.classList.add('preview');
  }
}

function clearPreview() {
  placementGrid.querySelectorAll('.preview').forEach(c => c.classList.remove('preview'));
}

function handlePlacement(x, y) {
  const success = placeShipAt(x, y);

  if (!success) {
    placementMsg.textContent = '⚠ Cannot place ship there — try again.';
    return;
  }

  placementMsg.textContent = '';
  renderPlacementGrid();
  updateShipQueue();

  if (!isPlacingShips()) {
    // All ships placed — switch to attack screen after short delay
    placementMsg.textContent = '✓ All ships placed! Starting game…';
    setTimeout(() => startAttackPhase(), 800);
  }
}

function updateShipQueue() {
  const remaining = getRemainingShips();
  shipQueueEl.innerHTML = '';
  remaining.forEach((name, i) => {
    const li = document.createElement('li');
    li.textContent = name;
    if (i === 0) li.classList.add('current');
    shipQueueEl.appendChild(li);
  });

  if (isPlacingShips()) {
    shipNameEl.textContent = `Placing: ${getCurrentShipName()} (${getCurrentShipLength()})`;
  }
}

// ─── Direction toggle ────────────────────────────────────────────────────────
// FIX: was never wired — setDirection now updates gameController's state
directionBtn.addEventListener('click', () => {
  const newDir = getDirection() === 'H' ? 'V' : 'H';
  setDirection(newDir);
  directionBtn.textContent = newDir === 'H' ? '↔ Horizontal' : '↕ Vertical';
  directionBtn.classList.toggle('vertical', newDir === 'V');
});

// ─── Attack phase ────────────────────────────────────────────────────────────
function startAttackPhase() {
  showScreen(gameScreen);
  renderGameBoards();
  updateScoreboard();
  setStatus('🎯 Your turn — click the enemy grid!', 'your-turn');
}

function renderGameBoards(disabled = false) {
  const playerOne = getPlayerOne();
  const playerTwo = getPlayerTwo();
  renderBoard(playerOne.board, playerBoardEl);
  renderBoard(playerTwo.board, enemyBoardEl, { isEnemy: true, disabled });
}

function setStatus(msg, state = 'default') {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className = ''; // clear old state classes
  if (state === 'your-turn')  statusEl.classList.add('status--your-turn');
  if (state === 'thinking')   statusEl.classList.add('status--thinking');
}

function updateScoreboard() {
  const p1 = getPlayerOne();
  const p2 = getPlayerTwo();
  if (playerSunkEl) playerSunkEl.textContent = p1.board.sunkCount();
  if (enemySunkEl)  enemySunkEl.textContent  = p2.board.sunkCount();
}

// Flash all cells of a fully sunk ship with the 'sunk' class
function animateSunk(boardEl, board, ship) {
  const coords = getSunkCoordsFor(board, ship);
  coords.forEach(([x, y]) => {
    const cell = boardEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
      cell.classList.add('sunk');
      // pulse animation — CSS handles the keyframe
      cell.classList.remove('sunk');
      void cell.offsetWidth; // force reflow to restart animation
      cell.classList.add('sunk');
    }
  });
}

function handleAttack(x, y) {
  const playerOne = getPlayerOne();
  const playerTwo = getPlayerTwo();
  const key = `${x},${y}`;

  if (playerTwo.board.attacked.has(key)) return;

  renderGameBoards(true);
  setStatus('Attacking…', 'default');

  const result = playerTurn([x, y]);

  // Check if the player just sank a ship — animate it on enemy board
  const sunkByPlayer = playerTwo.board.getLastSunkShip([x, y]);
  renderGameBoards(true);
  updateScoreboard();

  if (sunkByPlayer) animateSunk(enemyBoardEl, playerTwo.board, sunkByPlayer);

  if (result.winner === 'player') {
    setStatus('🎉 You sank the entire fleet! You win!', 'default');
    showGameOver('You win! 🎉');
    return;
  }

  setStatus('💭 Computer is thinking…', 'thinking');

  setTimeout(() => {
    // Find which cell the computer just hit by diffing attacked sets
    // (computer attack already happened inside playerTurn)
    renderGameBoards(false);
    updateScoreboard();

    // Animate any ship the computer just sank on the player board
    for (const ship of playerOne.board.ships) {
      if (ship.isSunk()) {
        const coords = getSunkCoordsFor(playerOne.board, ship);
        const justSunk = coords.every(([cx, cy]) =>
          playerOne.board.attacked.has(`${cx},${cy}`)
        );
        if (justSunk) animateSunk(playerBoardEl, playerOne.board, ship);
      }
    }

    if (result.winner === 'computer') {
      setStatus('💀 Computer sank your fleet. You lose!', 'default');
      showGameOver('Computer wins! 💀');
      return;
    }

    setStatus('🎯 Your turn — click the enemy grid!', 'your-turn');
  }, 900);
}

// ─── Game over ───────────────────────────────────────────────────────────────
function showGameOver(message) {
  const overlay = document.getElementById('gameover-overlay');
  const msgEl   = document.getElementById('gameover-msg');
  if (overlay && msgEl) {
    msgEl.textContent = message;
    overlay.style.display = 'flex';
  }
}

// ─── Start button ────────────────────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', () => {
  initGame();
  showScreen(placementScreen);
  renderPlacementGrid();
  updateShipQueue();
  setDirection('H');
  directionBtn.textContent = '↔ Horizontal';
});

// ─── Play again ───────────────────────────────────────────────────────────────
const playAgainBtn = document.getElementById('play-again-btn');
if (playAgainBtn) {
  playAgainBtn.addEventListener('click', () => {
    document.getElementById('gameover-overlay').style.display = 'none';
    initGame();
    showScreen(placementScreen);
    renderPlacementGrid();
    updateShipQueue();
    setDirection('H');
    directionBtn.textContent = '↔ Horizontal';
  });
}