export default class Gameboard{
    constructor(){
        this.board = [
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
            Array(10).fill(null),
        ]
        this.missedAttacks = [];
        this.attacked = new Set();
        this.ships = [];
    }

    placeShip(ship,[x,y],direction){
        if(direction === 'H'){
            if(y + ship.length > 10){
                throw new Error("Out of Bounds");
            }

            for(let i=0; i < ship.length; i++){
                if(this.board[x][y+i] !== null){
                    throw new Error("Over Lap")
                }
            }

            for(let i=0; i < ship.length; i++){
                this.board[x][y+i] = ship;
            }
        }
        else if(direction === 'V'){
            if(x + ship.length > 10){
                throw new Error("out of Bounds")
            }
            for(let i=0; i < ship.length; i++){
                if(this.board[x+i][y] !== null){
                    throw new Error("Over Lap")
                }
            }
            for(let i=0; i < ship.length; i++){
                this.board[x+i][y] = ship;
            }
        }
        this.ships.push(ship);
    }

    receiveAttack([x,y]){
        const key = `${x},${y}`;
        if(this.attacked.has(key)) return;
        this.attacked.add(key);

        const cell = this.board[x][y];
        if(cell === null){
            this.missedAttacks.push([x,y])
        }else{
             cell.hit()
        }
    }

    allShipSank(){
        return this.ships.every(ship=>ship.isSunk())
    }
    
}