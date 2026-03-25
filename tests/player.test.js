import { default as Gameboard } from "../src/modules/gameBoard.js";
import { default as Ship } from "../src/modules/ship.js";
import Player from "../src/modules/player.js";

describe("Test Player Properties and Methods",()=>{
    test("Player can attack Enemy Board",()=>{
        const player = new Player();
        const enemyBoard = new Gameboard();
        const ship = new Ship(1);
        enemyBoard.placeShip(ship,[0,0],"H");
        player.attack(enemyBoard,[0,0]);
        expect(ship.hits).toBe(1);
    })
    test("Player does not attack Enemy Board at same spot twice",()=>{
        const player = new Player();
        const enemyBoard = new Gameboard();
        const ship = new Ship(1);
        enemyBoard.placeShip(ship,[0,0],"H");
        player.attack(enemyBoard,[0,0]);
        player.attack(enemyBoard,[0,0]);
        expect(ship.hits).toBe(1);
    })
    test("Computer player makes a valid attack",()=>{
        const computer = new Player(true);
        const enemyBoard = new Gameboard();
        computer.attack(enemyBoard,[0,0])
        expect(enemyBoard.attacked.size).toBe(1);
    })
    test("computer does not attack same spot twice",()=>{
        const computer = new Player(true);
        const enemyBoard = new Gameboard();
        computer.attack(enemyBoard,[0,0])
        computer.attack(enemyBoard,[0,0])
        expect(enemyBoard.attacked.size).toBe(2);
    })
})