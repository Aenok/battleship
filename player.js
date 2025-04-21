import { GameBoard } from "./gameBoard.js"

class Player {
    constructor(isComp = false) {
        this.isComp = isComp;
        this.gb = new GameBoard();
    }
}