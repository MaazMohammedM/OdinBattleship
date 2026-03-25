import Gameboard from "./gameBoard.js";
import Player from "./player.js";
import Ship from "./ship.js";

let playerOne;
let playerTwo;
let currentPlayer;

let placingShips = true;

const shipsToPlace = [5, 4, 3, 3, 2];
let currentShipIndex = 0;

let currentDirection = "H";

function placeShipAt(x,y){
    if(!placingShips){
        return
    }

    const length = shipsToPlace[currentShipIndex];
    const ship = new Ship(length);
    
    try{
        playerOne.board.placeShip(ship,[x,y],currentDirection);
        currentShipIndex++

        if(currentShipIndex === shipsToPlace.length){
            placingShips=false;
            placeComputerShips();
        }
        return true
    }catch(e){
        return false
    }
}

function isPlacingShips(){
    return placingShips
}

function initGame(){
    playerOne = new Player(false);
    playerTwo = new Player(true);

    const boardOne = new Gameboard();
    const boardTwo = new Gameboard();

    playerOne.board = boardOne;
    playerTwo.board = boardTwo;

    currentPlayer = playerOne
}

function playerTurn(coord){
    const enemy = currentPlayer === playerOne ? playerTwo : playerOne;
    currentPlayer.attack(enemy.board,coord);
    currentPlayer = enemy;
}

function isGameOver(){
    return (playerOne.board.allShipSunk() || playerTwo.board.allShipSunk())
}

export {initGame,playerTurn,isGameOver,playerOne,playerTwo,placeShipAt,isPlacingShips}