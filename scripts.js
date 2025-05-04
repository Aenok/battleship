import { Player } from './player.js'

let colorArr = ['#EB7270', '#AD63C2', '#4CB6EC', '#727DC3', '#4AAAA1'];

const p1 = new Player();
const p2 = new Player();

let startPlayer = Math.floor(Math.random() * 2)    // randomly select starter

compInitShip("Cruiser", 5);
compInitShip("Battleship", 4);
compInitShip("Destroyer", 3);
compInitShip("Submarine", 3);
compInitShip("Patrol Boat", 2);

// helper function to parse through an array of arrays and check if an array exists as a value 
const includesArr = (arr, searchVal) => {
    return arr.some(ele => ele.every((val, i) => val == searchVal[i]));
}

function compInitShip(sName, length) {

    let valid = true;
    let coord = [];
    let deltaPos;
    let modArr = [[-1,0], [1,0], [0,1], [0,-1]];
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    coord.push([x,y]);
    coord.push(findRandomCoordinate())
    coord = populateRemainder(coord, length).sort();
    for(let i = 0; i < coord.length; i++) {
        for(let j = 0; j < p2.gb.shipArr.length; j++) {
            for(let k = 0; k < p2.gb.shipArr[j].coordinates.length; k++) {
                if(coord[i][0] == p2.gb.shipArr[j].coordinates[k][0] && coord[i][1] == p2.gb.shipArr[j].coordinates[k][1]) {
                    valid = false;
                }
            }
        }
    }
    if(valid) {
        p2.gb.initShip(sName, length, coord);
    } else {
        compInitShip(sName, length);
    }



    function findRandomCoordinate() {

        do {
            deltaPos = Math.floor(Math.random() * 4);
            x = coord[0][0] + modArr[deltaPos][0];
            y = coord[0][1] + modArr[deltaPos][1];
            // console.log(x, y)
        } while(x < 0 || y < 0 || x > 9 || y > 9);

        return [x,y];
    }

    function populateRemainder(array, max) {

        let x;
        let y;

        while(array.length != max) {
            if(array[0][0] == array[array.length-1][0]) {
                // x values are the same, y values are changing
                x = array[0][0];
                if(array[0][1] < array[array.length-1][1]) {
                    // y values are increasing
                    if(array[array.length-1][1] + 1 == 10) {
                        y = array[0][1] - 1;
                    } else {
                        y = array[array.length-1][1] + 1;
                    }
                } else {
                    // y values are decreasing
                    if(array[array.length-1][1] == 0) {
                        y = array[0][1] + 1;
                    } else {
                        y = array[array.length-1][1] - 1;
                    }
                }
            } else {
                // y values are the same, x values are changing
                y = array[0][1];
                if(array[0][0] < array[array.length - 1][0]) {
                    // x values are increasing
                    if(array[array.length - 1][0] + 1 == 10) {
                        x = array[0][0] - 1;
                    } else {
                        x = array[array.length - 1][0] + 1 
                    }
                } else {
                    //x values are decreasing
                    if(array[array.length-1][0]== 0) {
                        x = array[0][0] + 1;
                    } else {
                        x = array[array.length-1][0] - 1
                    }
                }
            }
            array.push([x,y]);
        }
        return array;
    }
}

async function selectPlayerCoordinates() {

    let message = document.getElementById('message');
    
    message.textContent = "Click and drag the location for your Cruiser (5)";
    let cruiser = await waitForDrag(5);
    p1.gb.initShip("Cruiser", 5, cruiser);

    message.textContent = "Click and drag the location of your Battleship (4)"
    let battleship = await waitForDrag(4);
    p1.gb.initShip("Battleship", 4, battleship);

    message.textContent = "Click and drag the location of your Destroyer (3)"
    let destroyer = await waitForDrag(3);
    p1.gb.initShip("Destroyer", 3, destroyer);

    message.textContent = "Click and drag the location of your Submarine (3)"
    let submarine = await waitForDrag(3);
    p1.gb.initShip("Submarine", 3, submarine);

    message.textContent = "Click and drag the location of your Patrol Boat (2)"
    let patrolBoat = await waitForDrag(2);
    p1.gb.initShip("Patrol Boat", 2, patrolBoat);

    renderBoard(p1, "your_gb");
    // renderBoard(p2, "op_gb");
    loadEvents();
}

function waitForDrag(length) {
    return new Promise((resolve) => {
        const handlers = new Map();
        let dragging = false;
        let retVal = [];
        let message = document.getElementById('message');

        let grid = document.getElementById('your_gb').children[1];

        function createOnMouseDown(x, y) {
            return function (e) {
                e.preventDefault();
                dragging = true;
                retVal.push([x,y]);
                e.target.classList.add('highlight');
            }
        }

        function createOnMouseEnter(x, y) {
            return function(e) {
                if(!dragging) {
                    return;
                }
                if(!includesArr(retVal, [x,y])) {
                    retVal.push([x,y]);
                    e.target.classList.add('highlight');
                }
            }
        }

        function createOnMouseUp(x, y) {
            return function(e) {
                if(dragging) {
                    let target = document.querySelectorAll(".highlight");
                    retVal = retVal.sort();
                    if(retVal.length == length && checkCoordinates(retVal)) {
                        target.forEach(cell => cell.classList.add("established"));
                        resolve(retVal);
                        cleanUp();
                    } 

                    target.forEach(cell => cell.classList.remove("highlight"));
                    dragging = false;
                    retVal = [];
                }
            }
        }

        function checkCoordinates(array) {

            let result = true;
            let xRes = true;
            let yRes = true;
            let checker;

            // check to see if all x values are the same
            array.forEach((ele) => {
                if(!(ele[0] == array[0][0])) {
                    xRes = false;
                }
            })

            // check to see if all y values are the same
            array.forEach((ele) => {
                if(!(ele[1] == array[0][1])) {
                    yRes = false;
                }
            })

            // all x values are different and y values are different. selection was not contiguous
            if(!(xRes || yRes)) {
                result = false;
            }

            for(let i = 0; i < p1.gb.shipArr.length; i++) {
                for(let j = 0; j < array.length; j++) {
                    if(includesArr(p1.gb.shipArr[i].coordinates, array[j])) {
                        return false;
                    }
                }
            }

            return result;
            
        }

        const cleanUp = () => {
            handlers.forEach((handler, cell) => {
                cell.removeEventListener('mousedown', handler[0]);
                cell.removeEventListener('mouseenter', handler[1]);
                cell.removeEventListener('mouseup', handler[2]);
            })
        }

        for(let i = 0; i < grid.children.length; i++) {
            for(let j = 0; j < grid.children[i].children.length; j++) {

                let downHandler = createOnMouseDown(i, j);
                grid.children[i].children[j].addEventListener('mousedown', downHandler);
                
                let enterHandler = createOnMouseEnter(i, j);
                grid.children[i].children[j].addEventListener('mouseenter', enterHandler);

                let upHandler = createOnMouseUp(i, j);
                grid.children[i].children[j].addEventListener('mouseup', upHandler);

                let handlerArr = [downHandler, enterHandler, upHandler];

                handlers.set(grid.children[i].children[j], handlerArr);
            }
        }

    })
}


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

function loadEvents() {


    if(startPlayer == 0) {
        playComputerTurn();
    } 

    document.getElementById("op_gb").classList.remove("disabled");

    let grid = document.getElementById('op_gb').children[1];
    let message = document.getElementById('message');
    message.textContent = "Start!"
    let pa = document.getElementById('pa');
    let btn = pa.children[0];

    btn.addEventListener('click', () => {
        location.reload();
    })

    for(let i = 0; i < grid.children.length; i++) {
        for(let j = 0; j < grid.children[i].children.length; j++) {
            grid.children[i].children[j].addEventListener('click', () => {
                // console.log(p1.gb.missArr);
                if(grid.children[i].children[j].children.length > 0 || grid.children[i].children[j].classList.contains("hit")) {
                    message.textContent = "Choice already attempted. Choose another coordinate"
                    return;
                }
                let result = p2.gb.receiveAttack(i,j);
                
                if(result == -1) {
                    // coordinates were a miss. Update grid and p1's missArr
                    let newImg = new Image();
                    newImg.src = './close.png';
                    grid.children[i].children[j].appendChild(newImg)
                    message.textContent = "Miss!"
                    playComputerTurn();
                } else {
                    result[1].hit();
                    let newImg = new Image();
                    newImg.src = './fire.png';
                    grid.children[i].children[j].appendChild(newImg);
                    grid.children[i].children[j].style.background = colorArr[result[0]];
                    message.textContent = `You hit your opponents ${result[1].name}!`;
                    grid.children[i].children[j].classList.add("hit");
                    if(p2.gb.isGameOver()) {
                        message.textContent = "Game Over - You won!"
                        disableCells();
                        pa.style.display = 'block';
                    } else {
                        playComputerTurn();
                    }

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
    let deltaPos;
    let modArr = [[-1,0], [1,0], [0,1], [0,-1]];
    let checker;

    if(Object.keys(p2.hitObj).length == 0) {
        // computer hasnt hit anything, so choose coordinates at random, checking against p2s gameboards missArr to not double up
        while(true) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            // console.log(`0. x = ${x}, y = ${y}`);
            if((!(x in p2.gb.missArr)) || (x in p2.gb.missArr && !(p2.gb.missArr[x].has(y)))){
                // console.log(`1. x = ${x}, y = ${y}`);
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
        // console.log(`------------------------`);
        // console.log(`shipname = ${shipName}`);
            // hitObj has only 1 key
        if(p2.hitObj[shipName].length == 1) {
            // computer hit once - i.e there is only 1 value for the 1 key- and doesnt know the correct direction. choose randomly, checking against missed coordinates.
            do {
                deltaPos = Math.floor(Math.random() * 4);
                x = p2.hitObj[shipName][0][0] + modArr[deltaPos][0];
                y = p2.hitObj[shipName][0][1] + modArr[deltaPos][1];

                // console.log("hitObj keys:");
                // console.log(Object.keys(p2.hitObj));
                for(let i = 0; i < Object.keys(p2.hitObj).length; i++) {
                    // console.log(`checking: ${p2.hitObj[Object.keys(p2.hitObj)[i]][0][0]}, ${p2.hitObj[Object.keys(p2.hitObj)[i]][0][1]}`);
                    checker = checker || ((x == p2.hitObj[Object.keys(p2.hitObj)[i]][0][0]) && y == p2.hitObj[Object.keys(p2.hitObj)[i]][0][1]);
                }
            }
            // continue the loop while the new value for x and y are either a) in the missArr, b) the same as the only value in the hitArr or c) out of bounds
            while(checker || (x in p2.gb.missArr && p2.gb.missArr[x].has(y)) || x < 0 || y < 0 || x > 9 || y > 9);

            // console.log(`2. x = ${x}, y = ${y}`);
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
                // console.log(`hits before: ${result[1].hits}`);
                result[1].hit();
                // console.log(`hits after: ${result[1].hits}`);
                if(result[1].name == shipName) {
                    if(result[1].isSunk()) {
                        // console.log(`a. hitObj before:`)
                        // console.log(p2.hitObj);
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
                        // console.log(`a. hitObj after:`)
                        // console.log(p2.hitObj);
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
                // console.log(p2.gb.missArr);
                // If p2.last = true, then the computer continues in the same direction its going.
                if(p2.hitObj[shipName][0][0] == p2.hitObj[shipName][p2.hitObj[shipName].length-1][0]) {
                    // x values are the same, therefore y values change and the shipName is laid out horizontally
                    x = p2.hitObj[shipName][0][0];
                    if(p2.hitObj[shipName][0][1] < p2.hitObj[shipName][p2.hitObj[shipName].length-1][1]) {
                        // y values are in increasing order in the value array.
                        if(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] == 9 || (x in p2.gb.missArr && p2.gb.missArr[x].has(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] + 1))) {
                            //ship is horizontally placed up to the right side of the edge of grid OR [x,y] are coordinates we've already tried and missed. The rest of the ship is in the other direction.
                            y = p2.hitObj[shipName][0][1] - 1;
                            // console.log(`3. x = ${x}, y = ${y}`);
                        } else {
                            y = p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] + 1;
                            // console.log(`4. x = ${x}, y = ${y}`);
                        }
                    } else {
                        // y values are in decreasing order in the value array.
                        if(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] == 0 || (x in p2.gb.missArr && p2.gb.missArr[x].has(p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] - 1))) {
                            // ship is horizontally placed up to the edge of the left side of the grid. The rest of the ship is in the other direction
                            y = p2.hitObj[shipName][0][1] + 1;
                            // console.log(`5. x = ${x}, y = ${y}`);
                        } else {
                            y = p2.hitObj[shipName][p2.hitObj[shipName].length-1][1] - 1;
                            // console.log(`6. x = ${x}, y = ${y}`);
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
                            // console.log(`7. x = ${x}, y = ${y}`);
                        } else {
                            x = p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] + 1;
                            // console.log(`8. x = ${x}, y = ${y}`);
                        }
                    } else {
                        // x values are in decreasing order in the value array
                        if(p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] == 0 || (p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] - 1 in p2.gb.missArr && p2.gb.missArr[p2.hitObj[shipName][p2.hitObj[shipName].length-1][0] - 1].has(y))) {
                            //ship is vertically placed up to the top side of the edge of grid. The rest of the ship is in the other direction
                            x = p2.hitObj[shipName][0][0] + 1;
                            // console.log(`9. x = ${x}, y = ${y}`);
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
                    // console.log(`ship being hit: = ${result[1].name}`);
                    newImg.src = './fire.png';
                    grid.children[x].children[y].appendChild(newImg)
                    // console.log(`${result[1].name} hits before: ${result[1].hits}`);
                    result[1].hit();
                    // console.log(`${result[1].name} hits after: ${result[1].hits}`);
                    if(result[1].name == shipName) {
                        if(result[1].isSunk()) {
                            // console.log(`b. hitObj before:`)
                            // console.log(p2.hitObj);
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
                            // console.log(`b. hitObj after:`)
                            // console.log(p2.hitObj);
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
                        console.log(`hits before: ${result[1].hits}`);
                        result[1].hit();
                        console.log(`hits after: ${result[1].hits}`);
                        if(result[1].isSunk()) {
                            // console.log(`b. hitObj before:`)
                            // console.log(p2.hitObj);
                            let a; 
                            let b;
                            for(let i = 0; i < result[1].coordinates.length; i++) {
                                a = result[1].coordinates[i][0];
                                b = result[1].coordinates[i][1];
                                console.log(`a = ${a}, b = ${b}`);
                                if(result[1].coordinates[i][0] in p2.gb.missArr) {
                                    p2.gb.missArr[a].add(b);
                                } else {
                                    newCont = new Set();
                                    newCont.add(result[1].coordinates[i][1]);
                                    p2.gb.missArr[result[1].coordinates[i][0]] = newCont;
                                }
                            }
                            delete p2.hitObj[shipName];
                            // console.log(`b. hitObj after:`)
                            // console.log(p2.hitObj);
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

    // console.log("Computer Turn Check")
    if(p1.gb.isGameOver()) {
        document.getElementById('message').textContent = "Game Over - Computer Wins!";
        disableCells();
    }
}

function disableCells() {
    let grid = document.getElementById("op_gb").children[1];

    for(let i = 0; i < grid.children.length; i++) {
        for(let j = 0; j < grid.children[i].children.length; j++) {
            grid.children[i].children[j].classList.add("disabled");
        }
    }
}

selectPlayerCoordinates();



