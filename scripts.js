import { Player } from './player.js'

let colorArr = ['#EB7270', '#AD63C2', '#4CB6EC', '#727DC3', '#4AAAA1'];

const p1 = new Player();
const p2 = new Player();

let startPlayer = p1;

// let startPlayer = Math.floor(Math.random() * 2) == 0 ? p1 : p2;     // randomly select starter


p1.gb.initShip("Cruiser", 5, [[5,3], [5,4], [5,5], [5,6], [5,7]]);
p1.gb.initShip("Battleship", 4, [[0,2], [1,2], [2,2], [3,2]]);
p1.gb.initShip("Destroyer", 3, [[2,0], [3,0], [4,0]]);
p1.gb.initShip("Submarine", 3, [[3,5], [3,6], [3,7]]);
p1.gb.initShip("Patrol Boat", 2, [[9,0], [9,1]]);

p2.gb.initShip("Cruiser", 5, [[5,3], [5,4], [5,5], [5,6], [5,7]]);
p2.gb.initShip("Battleship", 4, [[0,2], [1,2], [2,2], [3,2]]);
p2.gb.initShip("Destroyer", 3, [[2,0], [3,0], [4,0]]);
p2.gb.initShip("Submarine", 3, [[3,5], [3,6], [3,7]]);
p2.gb.initShip("Patrol Boat", 2, [[9,0], [9,1]]);

// p2.gb.initShip(5, [[2,6], [3,6], [4,6], [5,6], [6,6]]);
// p2.gb.initShip(4, [[7,0], [7,1], [7,2], [7,3]]);
// p2.gb.initShip(3, [[0,0], [1,0], [2,0]], true);
// p2.gb.initShip(3, [[7,9], [8,9], [9,9]]);
// p2.gb.initShip(2, [[0,9], [1,9]]);

function renderBoard(player, gb_id) {

    let grid = document.getElementById(gb_id).children[1];
    let x;
    let y;

    for(let i = 0; i < player.gb.shipArr.length; i++) {
        for(let j = 0; j < player.gb.shipArr[i].coordinates.length; j++) {
            x = player.gb.shipArr[i].coordinates[j][0];
            y = player.gb.shipArr[i].coordinates[j][1];
            grid.children[x].children[y].style.background = colorArr[i]
        }
    }

}

function loadCompGridCellEvents() {
    let grid = document.getElementById('op_gb').children[1];
    // let message = document.getElementById('message');
    for(let i = 0; i < grid.children.length; i++) {
        for(let j = 0; j < grid.children[i].children.length; j++) {
            grid.children[i].children[j].addEventListener('click', () => {
                let result = p2.gb.receiveAttack(i,j);
                if(result == -2) {

                } else if(result == -1) {
                    let newImg = new Image();
                    newImg.src = './close.png';
                    grid.children[i].children[j].appendChild(newImg)
                    // message.textContent = "Miss!"
                } else {
                    grid.children[i].children[j].style.background = colorArr[result[0]];
                    // message.textContent = "Hit!"

                }
            })
        }
    }
}

function playComputerTurn() {

    let grid = document.getElementById('your_gb').children[1];
    let x;
    let y;
    let result;
    let newImg;
    let newCont;
    let shipName;
    let modArr = [[-1,0], [1,0], [0,1], [0,-1]];

    if(Object.keys(p2.hitObj).length == 0) {
        // computer hasnt hit anything, so choose coordinates at random, checking against p2s gameboards missArr to not double up
        while(true) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            console.log(`0. x = ${x}, y = ${y}`);
            // console.log(p2.gb.missArr);
            if((!(x in p2.gb.missArr)) || (x in p2.gb.missArr && !(p2.gb.missArr[x].has(y)))){
                console.log(`1. x = ${x}, y = ${y}`);
                result = p1.gb.receiveAttack(x, y);
                newImg = new Image();
                if(result == -1) {
                    newImg.src = './close.png';
                    grid.children[x].children[y].appendChild(newImg)
                    p2.last = false;
                    if(!(x in p2.gb.missArr)) {
                        let newCont = new Set();
                        newCont.add(y);
                        p2.gb.missArr[x] = newCont;
                    } else {
                        p2.gb.missArr[x].add(y);
                    }
                } else {
                    newImg.src = './fire.png';
                    grid.children[x].children[y].appendChild(newImg)
                    result[1].hit();
                    newCont = []
                    newCont.push([x,y]);
                    p2.hitObj[result[1].name] = newCont;
                    p2.last = true;
                }
                break;
            }
        }
    } else {
        // computer recently hit something. We want it to choose a next element logically. Set the ship were seeking out to be the first ship in the hitObj (possibly multiple ships depending on placement)
        shipName = Object.keys(p2.hitObj)[0];

        if(Object.keys(p2.hitObj).length == 1) {
            // hitObj has only 1 key
            if(p2.hitObj[shipName].length == 1) {
                // computer hit once - i.e there is only 1 value for the 1 key- and doesnt know the correct direction. choose randomly, checking against missed coordinates.
                do {


                    let deltaPos = Math.floor(Math.random() * 4);
                    x = p2.hitObj[shipName][0][0] + modArr[deltaPos][0];
                    y = p2.hitObj[shipName][0][1] + modArr[deltaPos][1];

                    // delta and op variables add randomness to the selection
                    // let deltaX = Math.floor(Math.random() * 2);
                    // let xOp = Boolean(Math.floor(Math.random() * 2));
                    // let deltaY = Math.floor(Math.random() * 2);
                    // let yOp = Boolean(Math.floor(Math.random() * 2));
    
                    // // console.log(p2.hitObj[shipName][0][0]);
    
                    // if(xOp) {
                    //     x = p2.hitObj[shipName][0][0] + deltaX;
                    // } else {
                    //     x = p2.hitObj[shipName][0][0] - deltaX;
                    // }
    
                    // if(yOp) {
                    //     y = p2.hitObj[shipName][0][1] + deltaY;
                    // } else {
                    //     y = p2.hitObj[shipName][0][1] - deltaY;
                    // }
                }
                // continue the loop while the new value for x and y are either a) in the missArr, b) the same as the only value in the hitArr or c) out of bounds
                while(!((!(x in p2.gb.missArr)) || (x in p2.gb.missArr && !(p2.gb.missArr[x].has(y)))) || (x == p2.hitObj[shipName][0][0] && y == p2.hitObj[shipName][0][1]) || x >= 10 || x <= -1|| y >= 10 || y <= -1);

                console.log(`2. x = ${x}, y = ${y}`);
                result = p1.gb.receiveAttack(x, y);
                newImg = new Image();
                if(result == -1) {
                    newImg.src = './close.png';
                    grid.children[x].children[y].appendChild(newImg)
                    p2.last = false;
                    if(!(x in p2.gb.missArr)) {
                        newCont = new Set();
                        newCont.add(y);
                        p2.gb.missArr[x] = newCont;
                    } else {
                        p2.gb.missArr[x].add(y);
                    }
                } else {
                    newImg.src = './fire.png';
                    grid.children[x].children[y].appendChild(newImg)
                    if(result[1].name == shipName) {
                        // console.log(`hits before: ${result[1].hits}`);
                        result[1].hit();
                        // console.log(`hits after: ${result[1].hits}`);
                        if(result[1].isSunk()) {
                            console.log(`a. hitObj before:`)
                            console.log(p2.hitObj);
                            for(let i = 0; i < result[1].coordinates.length; i++) {
                                if(result[1].coordinates[i][0] in p2.gb.missArr) {
                                    p2.gb.missArr[result[1].coordinates[i][0]].add(result[1].coordinates[i][1]);
                                } else {
                                    newCont = new Set();
                                    newCont.add(result[1].coordinates[i][1]);
                                    p2.gb.missArr[result[1].coordinates[i][0]] = newCont;
                                }
                            }
                            delete p2.hitObj[shipName];
                            console.log(`a. hitObj after:`)
                            console.log(p2.hitObj);
                        } else {
                            p2.hitObj[shipName].push([x,y]);
                        }
    
                    } else {
                        newCont = [];
                        newCont.push([x,y]);
                        p2.hitObj[result[1].name] = newCont;
                    }
                    p2.last = true;
                    
                }
                
            } else {
                // there are 2+ values for the 1 key. Need to find the direction to go in.                
                if(p2.last == true) {
                    // If p2.last = true, then the computer continues in the same direction its going.
                    if(p2.hitObj[shipName][0][0] == p2.hitObj[shipName][p2.hitObj[shipName].length-1][0]) {
                        // x values are the same, therefore y values change and the shipName is laid out horizontally
                        x = p2.hitObj[shipName][0][0];
                        if(p2.hitObj[shipName][0][1] < p2.hitObj[shipName][p2.hitObj[shipName].length-1][1]) {
                            // y values are in increasing order in the value array.
                            if(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] == 9 || (x in p2.gb.missArr && p2.gb.missArr[x].has(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] + 1))) {
                                //ship is horizontally placed up to the right side of the edge of grid OR [x,y] are coordinates we've already tried and missed. The rest of the ship is in the other direction.
                                y = p2.hitObj[shipName][0][1] - 1;
                                console.log(`3. x = ${x}, y = ${y}`);
                            } else {
                                y = p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] + 1;
                                console.log(`4. x = ${x}, y = ${y}`);
                            }
                        } else {
                            // y values are in decreasing order in the value array.
                            if(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] == 0 || (x in p2.gb.missArr && p2.gb.missArr[x].has(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] - 1))) {
                                // ship is horizontally placed up to the edge of the left side of the grid. The rest of the ship is in the other direction
                                y = p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] + 1;
                                console.log(`5. x = ${x}, y = ${y}`);
                            } else {
                                y = p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] - 1;
                                console.log(`6. x = ${x}, y = ${y}`);
                            }
                        }

                    } else {
                        // y values are the same, therefore x values change and the ship is laid out vertically
                        y = p2.hitObj[shipName][0][1];
                        if(p2.hitObj[shipName][0][0] < p2.hitObj[shipName][p2.hitObj[shipName].length-1][0]) {
                            // x values are in increasing order in the value array
                            if(p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] == 9 || (p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] + 1 in p2.gb.missArr && p2.gb.missArr[p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] + 1].has(y))) {
                                //ship is vertically placed up to the bottom side of the edge of grid. The rest of the ship is in the other direction
                                x = p2.hitObj[shipName][0][0] - 1;
                                console.log(`7. x = ${x}, y = ${y}`);
                            } else {
                                x = p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] + 1;
                                console.log(`8. x = ${x}, y = ${y}`);
                            }
                        } else {
                            // x values are in decreasing order in the value array
                            if(p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] == 0 || (p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] - 1 in p2.gb.missArr && p2.gb.missArr[p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] - 1].has(y))) {
                                //ship is vertically placed up to the top side of the edge of grid. The rest of the ship is in the other direction
                                x = p2.hitObj[shipName][0][0] + 1;
                                console.log(`9. x = ${x}, y = ${y}`);
                            } else {
                                // console.log(`val is ${p2.hitObj[shipName][0][0]}`);
                                x = p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] - 1;
                                // console.log(`10. x = ${x}, y = ${y}`);
                            }
                        }
                    }

                    result = p1.gb.receiveAttack(x, y);
                    newImg = new Image();
                    if(result == -1) {
                        newImg.src = './close.png';
                        grid.children[x].children[y].appendChild(newImg)
                        p2.last = false;
                        if(!(x in p2.gb.missArr)) {
                            newCont = new Set();
                            newCont.add(y);
                            p2.gb.missArr[x] = newCont;
                        } else {
                            p2.gb.missArr[x].add(y);
                        }
                    } else {
                        newImg.src = './fire.png';
                        grid.children[x].children[y].appendChild(newImg)
                        if(result[1].name == shipName) {
                            // console.log(`hits before: ${result[1].hits}`);
                            result[1].hit();
                            // console.log(`hits after: ${result[1].hits}`);
                            if(result[1].isSunk()) {
                                console.log(`b. hitObj before:`)
                                console.log(p2.hitObj);
                                let a; 
                                let b;
                                for(let i = 0; i < result[1].coordinates.length; i++) {
                                    a = result[1].coordinates[i][0];
                                    b = result[1].coordinates[i][1];
                                    // console.log(`a = ${a}, b = ${b}`);
                                    if(result[1].coordinates[i][0] in p2.gb.missArr) {
                                        p2.gb.missArr[a].add(b);
                                    } else {
                                        newCont = new Set();
                                        newCont.add(result[1].coordinates[i][1]);
                                        p2.gb.missArr[result[1].coordinates[i][0]] = newCont;
                                    }
                                }
                                delete p2.hitObj[shipName];
                                console.log(`b. hitObj after:`)
                                console.log(p2.hitObj);
                            } else {
                                p2.hitObj[shipName].push([x,y]);
                            }
        
                        } else {
                            newCont = [];
                            newCont.push([x,y]);
                            p2.hitObj[result[1].name] = newCont;
                        }
                        p2.last = true; 
                    }

                }else {  
                /* The computer current has 2+ values for the first key. If p2.last = false, this means it followed the right direction and eventually reached a "miss". This means that the 
                original hit occurred somewhere in the middle of the ship. The computer followed one of the correct directions, eventually reaching the end.  We must check the first element
                of the hitObj, and decipher where it must go*/
                    if(p2.hitObj[shipName][0][0] == p2.hitObj[shipName][p2.hitObj[shipName].length-1][0]) {
                        // x values are not changing, the ship is laid out horizontally and the y values change
                        x = p2.hitObj[shipName][0][0];
                        if(p2.hitObj[shipName][0][1] < p2.hitObj[shipName][p2.hitObj[shipName].length-1][1]) {
                            // y values were increasing down the array when the computer missed. The next value is behind the first.
                            y = p2.hitObj[shipName][0][1] - 1;
                        } else {
                            // y values were decreasing dow nthe array when the computer missed. The next value ahead of the first.
                            y = p2.hitObj[shipName][0][1] + 1
                        }
                    } else {
                        // y values are not changing, the ship is laid out vertically and the x values change
                        y = p2.hitObj[shipName][0][1];
                        if(p2.hitObj[shipName][0][0] < p2.hitObj[shipName][p2.hitObj[shipName].length-1][0]) {
                            // y values were increasing down the array when the computer missed. The next value is behind the first
                            x = p2.hitObj[shipName][0][0] - 1;
                        } else {
                            // y values were decreasing dow nthe array when the computer missed. The next value ahead of the first.
                            x = p2.hitObj[shipName][0][0] + 1
                        }
                    }
                    result = p1.gb.receiveAttack(x, y);
                    newImg = new Image();
                    if(result == -1) {
                        newImg.src = './close.png';
                        grid.children[x].children[y].appendChild(newImg)
                        p2.last = false;
                        if(!(x in p2.gb.missArr)) {
                            newCont = new Set();
                            newCont.add(y);
                            p2.gb.missArr[x] = newCont;
                        } else {
                            p2.gb.missArr[x].add(y);
                        }
                    } else {
                        newImg.src = './fire.png';
                        grid.children[x].children[y].appendChild(newImg)
                        if(result[1].name == shipName) {
                            // console.log(`hits before: ${result[1].hits}`);
                            result[1].hit();
                            // console.log(`hits after: ${result[1].hits}`);
                            if(result[1].isSunk()) {
                                console.log(`b. hitObj before:`)
                                console.log(p2.hitObj);
                                let a; 
                                let b;
                                for(let i = 0; i < result[1].coordinates.length; i++) {
                                    a = result[1].coordinates[i][0];
                                    b = result[1].coordinates[i][1];
                                    // console.log(`a = ${a}, b = ${b}`);
                                    if(result[1].coordinates[i][0] in p2.gb.missArr) {
                                        p2.gb.missArr[a].add(b);
                                    } else {
                                        newCont = new Set();
                                        newCont.add(result[1].coordinates[i][1]);
                                        p2.gb.missArr[result[1].coordinates[i][0]] = newCont;
                                    }
                                }
                                delete p2.hitObj[shipName];
                                console.log(`b. hitObj after:`)
                                console.log(p2.hitObj);
                            } else {
                                p2.hitObj[shipName].push([x,y]);
                            }
        
                        } else {
                            newCont = [];
                            newCont.push([x,y]);
                            p2.hitObj[result[1].name] = newCont;
                        }
                        p2.last = true; 
                    }

                }

            }

        }
    }
}

renderBoard(p1, 'your_gb');
// renderBoard(p2, 'op_gb')
loadCompGridCellEvents();
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()
playComputerTurn()



