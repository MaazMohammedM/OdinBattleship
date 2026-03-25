export default class Player {
    constructor(isComputer = false) {
        this.isComputer = isComputer;
    }
    attack(gameboard, coord) {
        if (this.isComputer) {
            let x, y,key;
            do {
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
                key = `${x},${y}`;
            }
            while (gameboard.attacked.has(key));
            gameboard.receiveAttack([x, y]);

        } else {
            gameboard.receiveAttack(coord);
        }
    }
}