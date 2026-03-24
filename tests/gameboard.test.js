import Gameboard from "../src/modules/gameBoard";
import Ship from "../src/modules/ship";

describe("Test Gameboard Properties and methods", () => {
    test("Gameboard Class exists", () => {
        const game = new Gameboard();
        expect(game).toBeDefined()
    })
    test("Place ship at given coordinates Horizontally", () => {
        const game = new Gameboard();
        const ship = new Ship(3);
        game.placeShip(ship, [0, 0], 'H')
        expect(game.board[0][0]).toBe(ship)
    })
    test("Place ship at given coordinates vertically", () => {
        const game = new Gameboard();
        const ship = new Ship(3);
        game.placeShip(ship, [1, 0], 'V')
        expect(game.board[1][0]).toBe(ship)
    })
    test("does not allow ship placement outside horizontal bounds", () => {
        const game = new Gameboard();
        const ship = new Ship(3);
        expect(() => {
            game.placeShip(ship, [0, 8], "H")
        }).toThrow()
    })
    test("does not allow ship placement outside vertical bounds", () => {
        const game = new Gameboard();
        const ship = new Ship(3);
        expect(() => {
            game.placeShip(ship, [8, 8], "V")
        }).toThrow()
    })
    test("does not allow overlapping ships", () => {
        const game = new Gameboard();
        const shipOne = new Ship(3);
        const shipTwo = new Ship(3);
        game.placeShip(shipOne, [0, 0], "H");
        expect(() => {
            game.placeShip(shipTwo, [0, 8], "H")
        }).toThrow()
    })
    test("Calls Hit function when attacked", () => {
        const game = new Gameboard();
        const ship = new Ship(3);
        game.placeShip(ship, [0, 0], "H");
        game.receiveAttack([0, 0]);
        expect(ship.hits).toBe(1);
    })
    test("Record a Missed Attack", () => {
        const game = new Gameboard();
        game.receiveAttack([0, 0]);
        expect(game.missedAttacks).toContainEqual([0, 0]);
    })
    test("Does not hit the same spot twice", () => {
        const gameboard = new Gameboard();
        const ship = new Ship(2);

        gameboard.placeShip(ship, [0, 0], 'H');

        gameboard.receiveAttack([0, 0]);
        gameboard.receiveAttack([0, 0]);

        expect(ship.hits).toBe(1);
    })
    test("returns true when all ships are sunk",()=>{
        const gameBoard = new Gameboard();
        const shipOne = new Ship(1);
        const shipTwo = new Ship(1);
        gameBoard.placeShip(shipOne,[0,0],'H');
        gameBoard.placeShip(shipTwo,[1,0],'H');
        gameBoard.receiveAttack([0,0]);
        gameBoard.receiveAttack([1,0]);
        expect(gameBoard.allShipSank()).toBe(true);
    })
})