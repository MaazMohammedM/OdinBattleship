import { isPlacingShips, placeShipAt, playerOne,playerTurn,playerTwo } from "./gameController.js";


function renderBoard(board, container, isEnemy = false) {
    container.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.dataset.x = i;
            cell.dataset.y = j;
            const value = board.board[i][j];

            if (!isEnemy && value !== null) {
                cell.classList.add('ship')
            }

            const key = `${i},${j}`;
            if (board.attacked.has(key)) {
                if (value === null) {
                    cell.classList.add('miss');
                } else {
                    cell.classList.add('hit');
                }
            }

            if (isEnemy) {
                cell.addEventListener('click', () => {
                    if(isPlacingShips){
                        const success = placeShipAt(i,j)
                        render()
                    }else{
                        playerTurn([i, j]);
                    }
                })
            }

            container.appendChild(cell);
        }
    }
}

function render() {
    const playerBoard = document.getElementById("player-board");
    const enemyBoard = document.getElementById("enemy-board");

    renderBoard(playerOne.board,playerBoard);
    renderBoard(playerTwo.board,enemyBoard,true);
}

export {render}