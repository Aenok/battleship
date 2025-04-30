import { Ship } from "./ship.js"

export class GameBoard {
    constructor() {
        this.shipArr = [];
        this.missArr = {}; // object will be set up in dictionary style. Key will be an int representing the x value of a missed coordinate, value will be an array of integers, each representing the y value of a missed coordinate
    }

    initShip(name, length, coordinates) {

        if(length !== coordinates.length) {
            return "Incorrect Ship Length"
        }
        
        for(let i = 0; i < coordinates.length; i++) {
            for(let j = 0; j < coordinates[i].length; j++) {
                if(coordinates[i][j] > 9 || coordinates[i][j] < 0) {
                    return "Out of bounds";
                }
            }
        }
        let newShip = new Ship(name, length, coordinates);
        this.shipArr.push(newShip);
    }

    receiveAttack(x, y) {

        if(x in this.missArr && this.missArr[x].has(y)) {
            return -2;
        }

        let hit_ship;
        for(let i = 0; i < this.shipArr.length; i++) {
            for(let j = 0; j < this.shipArr[i].coordinates.length; j++) {
                if(this.shipArr[i].coordinates[j][0] == x && this.shipArr[i].coordinates[j][1] == y) {
                    hit_ship = this.shipArr[i];
                    break;
                }
            }
        }

        if(hit_ship != undefined) {
            hit_ship.addHitCoordinates(x, y);
            return [this.shipArr.indexOf(hit_ship), hit_ship];
        } else {
            if(x in this.missArr) {
                this.missArr[x].add(y);
            } else {
                let newSet = new Set();
                newSet.add(y)
                this.missArr[x] = newSet;
            }
            return -1;
        }
    }

    isGameOver() {
        let sunkArr = [];
        for(let i = 0; i < this.shipArr.length; i++) {
            sunkArr.push(this.shipArr[i].isSunk());
        }
        
        return !sunkArr.includes(false)     // if true, false is not part of array and game is over, if false, false is part of array and the game continues
    }
}