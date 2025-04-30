export class Ship {
    constructor(name, length, coordinates) {
        this.name = name;
        this.length = length;
        this.hits = 0;
        this.coordinates = coordinates;
        this._coordinatesHit = {};
    }

    hit() {
        return ++this.hits;
    }

    addHitCoordinates(x, y) {
        if(x in this._coordinatesHit && this._coordinatesHit[x].has(y)) {
            return "Coordinates already hit";
        } else if (x in this._coordinatesHit && !this._coordinatesHit[x].has(y)){
            this._coordinatesHit[x].add(y);
        } else {
            let newSet = new Set();
            newSet.add(y);
            this._coordinatesHit[x] = newSet;            
        }
        return "Hit!";
    }

    isSunk() {
        // console.log(`hits == ${this.hits}, length == ${this.length}`);
        if(this.hits === this.length) {
            return true;
        } else {
            return false;
        }
    }
}