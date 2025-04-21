import { Ship } from "./ship.js"

/* --------------------- SHIP TESTING --------------------- */

test('ship hit test 1', () => {
    const ship = new Ship(5, []);
    expect(ship.hits).toBe(0);
})

test('ship hit test 2', () => {
    const ship = new Ship(5, []);
    ship.hit()
    expect(ship.hits).toBe(1);
})

test('ship is sunk 1', () => {
    const ship = new Ship(5, []);
    expect(ship.isSunk()).toBeFalsy();
})

test('ship is sunk 2', () => {
    const ship = new Ship(0, []);
    expect(ship.isSunk()).toBeTruthy();
})

test('ship is sunk 3', () => {
    const ship = new Ship(1, []);
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
})

test('ship is sunk 3', () => {
    const ship = new Ship(2, []);
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
})
