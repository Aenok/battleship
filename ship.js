export class Ship {
    constructor(length, coordinates, isDestroyer = false) {
        this.length = length;
        this.hits = 0;
        this.coordinates = coordinates;
        this.isDestroyer = isDestroyer;
    }

    hit() {
        return ++this.hits;
    }

    isSunk() {
        if(this.hits === this.length) {
            return true;
        } else {
            return false;
        }
    }
}