import { Ship } from "./ship.js"
import { GameBoard } from "./gameBoard.js"

/* --------------------- SHIP TESTING --------------------- */

test('ship hit test 1', () => {
    const ship = new Ship(5, []);
    expect(ship.hit()).toBe(1);
})

test('hit coordinates 1', () => {
    const ship = new Ship(3, [[0,0], [0,1], [0,2]]);
    expect(ship.addHitCoordinates(0,0)).toBe("Hit!");
})

test('hit coordinates 2', () => {
    const ship = new Ship(3, [[0,0], [0,1], [0,2]]);
    let newSet = new Set();
    newSet.add(0);
    ship._coordinatesHit[0] = newSet;
    expect(ship.addHitCoordinates(0,0)).toBe("Coordinates already hit");
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



/* --------------------- GAMEBOARD TESTING --------------------- */

test('gameboard out of bounds 1', () => {
    let gb = new GameBoard();
    expect(gb.initShip(1, [[10, 5]])).toBe("Out of bounds");
})

test('gameboard out of bounds 2', () => {
    let gb = new GameBoard();
    expect(gb.initShip(1, [[-10, 5]])).toBe("Out of bounds");
})

test('gameboard out of bounds 3', () => {
    let gb = new GameBoard();
    expect(gb.initShip(1, [[5, 10]])).toBe("Out of bounds");
})

test('gameboard out of bounds 4', () => {
    let gb = new GameBoard();
    expect(gb.initShip(1, [[5, -10]])).toBe("Out of bounds");
})

test('incorrect ship length', () => {
    let gb = new GameBoard();
    expect(gb.initShip(5, [[0,0]])).toBe("Incorrect Ship Length");
})

test('attack received, ship hit 1', () => {
    let gb = new GameBoard();
    gb.initShip(3, [[0,0], [0,1], [0,2]]);
    expect(gb.receiveAttack(0, 0)).toBe(1);
})

test('attack received, ship missed 1', () => {
    let gb = new GameBoard();
    gb.initShip(3, [[0,0], [0,1], [0,2]]);
    expect(gb.receiveAttack(10, 0)).toBe("Attack Missed");
})

test('is game over 1', () => {
    let gb = new GameBoard();
    gb.initShip(3, [[0,0], [0,1], [0,2]]);
    gb.initShip(3, [[1,0], [1,1], [1,2]]);
    gb.initShip(3, [[2,0], [2,1], [2,2]]);
    expect(gb.isGameOver()).toBeFalsy();
})

test('is game over 2', () => {
    let gb = new GameBoard();
    gb.initShip(3, [[0,0], [0,1], [0,2]]);
    gb.receiveAttack(0,0);
    gb.receiveAttack(0,1);
    gb.receiveAttack(0,2);
    expect(gb.isGameOver()).toBeTruthy();
})

test('is game over 3', () => {
    let gb = new GameBoard();
    gb.initShip(3, [[0,0], [0,1], [0,2]]);
    gb.receiveAttack(0,0);
    gb.receiveAttack(0,1);
    // gb.receiveAttack(0,2);
    expect(gb.isGameOver()).toBeFalsy();
})
