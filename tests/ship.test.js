import Ship from "../src/modules/ship.js"

const ship = new Ship(3);
describe("Ship",()=>{
    test("Test ship Function Exists",()=>{
        expect(ship).toBeDefined()
    }),
    test("Test ship stores it's length",()=>{
        expect(ship.length).toBe(3)
    })
})