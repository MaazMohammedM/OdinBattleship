import Ship from "../src/modules/ship.js"



describe("Ship",()=>{
    test("Test ship Function Exists",()=>{
        const ship = new Ship(3);
        expect(ship).toBeDefined()
    }),
    test("Test ship stores it's length",()=>{
        const ship = new Ship(3);
        expect(ship.length).toBe(3)
    }),
    test("Test Hit function increases hit count",()=>{
        const ship = new Ship(3);
        ship.hit();
        expect(ship.hits).toBe(1)
    }),
    test("Ship is not sunk initially",()=>{
        const ship = new Ship(3);
        expect(ship.isSunk()).toBe(false)
    })
    test("Ship is sunk when hit length times",()=>{
        const ship = new Ship(2);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true)
    })
    test("Ship is not sunk if hits are less than length",()=>{
        const ship = new Ship(2);
        ship.hit();
        expect(ship.isSunk()).toBe(false)
    })
    test("Hit count should not exceed ship length",()=>{
        const ship = new Ship(2);
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true)
    })
})