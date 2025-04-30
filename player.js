import { GameBoard } from "./gameBoard.js"

export class Player {
    constructor() {
        this.gb = new GameBoard();
        this.hitObj = {};   // used just for the computer to check for recent hits and logically choose where to look next
        this.last = false;  // used just for the computer to check if the last attack hit or not 
    }
}