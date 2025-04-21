export class Ship {
    constructor(length, coordinates) {
        this.length = length;
        this.hits = 0;
        this.coordinates = coordinates;
    }

    hit() {
        this.hits++;
    }

    isSunk() {
        if(this.hits === this.length) {
            return true;
        } else {
            return false;
        }
    }
}