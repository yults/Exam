"use strict";

function BoardConfiguration(board) {
    this.rows = [];
    this.lines = [];
    this.cubes = [];
    this.board = [];
    for (let i = 0; i < 9; i++) {
        this.rows[i] = [];
        this.lines[i] = [];
        this.board[i] = [];
        for (let j = 0; j < 9; j++) {
            this.rows[i][j] = board[i][j];
            this.lines[i][j] = board[j][i];
            this.board[i][j] = board[i][j];
        }
    }
    for (let z = 0; z < 9; z++) {
        this.cubes[z] = [];
        for (let i = 0; i < 3; i++) {
            this.cubes[z][i] = [];
            for (let j = 0; j < 3; j++) {
                this.cubes[z][i][j] = board[i + Math.floor(z / 3) * 3][j + (z % 3) * 3];
            }
        }
    }
}

BoardConfiguration.prototype.makeForecast = function () {
    for (let i = 0; i < 9; i++) {
        let inRow = new Set();
        for (let j = 0; j < 9; j++) {
            if (this.rows[i][j] !== '0') {
                inRow.add(this.rows[i][j]);
            }
        }
        let forecast = [];
        let cnt = 0;
        for (let j = 1; j < 10; j++) {
            if (!inRow.has(j.toString())) {
                forecast[cnt] = j;
                cnt++;
            }
        }
        for (let j = 0; j < 9; j++) {
            if (this.rows[i][j] === '0') {
                this.rows[i][j] = forecast;
            }
        }
    }
    for (let i = 0; i < 9; i++) {
        let inLine = new Set();
        for (let j = 0; j < 9; j++) {
            if (this.lines[i][j] !== '0') {
                inLine.add(this.lines[i][j]);
            }
        }
        let forecast = [];
        let cnt = 0;
        for (let j = 1; j < 10; j++) {
            if (!inLine.has(j.toString())) {
                forecast[cnt] = j;
                cnt++;
            }
        }
        for (let j = 0; j < 9; j++) {
            if (this.lines[i][j] === '0') {
                this.lines[i][j] = forecast;
            }
        }
    }

    for (let z = 0; z < 9; z++) {
        let inCube = new Set();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.cubes[z][i][j] !== '0') {
                    inCube.add(this.cubes[z][i][j]);
                }
            }
        }
        let forecast = [];
        let cnt = 0;
        for (let j = 1; j < 10; j++) {
            if (!inCube.has(j.toString())) {
                forecast[cnt] = j;
                cnt++;
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.cubes[z][i][j] === '0') {
                    this.cubes[z][i][j] = forecast;
                }
            }
        }
    }
    this.connectForecast();
}

BoardConfiguration.prototype.connectForecast = function () {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let row, line, cube;
            let inRow = new Set();
            let inCube = new Set();
            let inLine = new Set();
            let inBoard = new Set();
            if (this.board[i][j] === '0') {
                row = this.rows[i][j];
                line = this.lines[j][i];
                cube = this.cubes[Math.floor(i / 3) * 3 + Math.floor(j / 3)][i % 3][j % 3];
                for (let z = 0; z < row.length; z++) {
                    inRow.add(row[z]);
                }
                for (let z = 0; z < line.length; z++) {
                    inLine.add(line[z]);
                }
                for (let z = 0; z < cube.length; z++) {
                    inCube.add(cube[z]);
                }
                for (let z = 1; z < 10; z++) {
                    if (inCube.has(z) && inLine.has(z) && inRow.has(z)) {
                        inBoard.add(z.toString());
                    }
                }
                let forecast = [];
                let cnt = 0;
                for (let z = 1; z < 10; z++) {
                    if (inBoard.has(z.toString())) {
                        forecast[cnt] = z.toString();
                        cnt++;
                    }
                }
                if (cnt === 1) {
                    this.board[i][j] = forecast[0];
                }
                else {
                    this.rows[i][j] = forecast;
                    this.lines[j][i] = forecast;
                    this.cubes[Math.floor(i / 3) * 3 + Math.floor(j / 3)][i % 3][j % 3] = forecast;
                }
            }
        }
    }
}


BoardConfiguration.prototype.printBoard = function () {
    for (let i = 0; i < 9; i++) {
        console.log(this.board[i]);
    }
};

BoardConfiguration.prototype.checkIsSolved = function () {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (this.board[i][j] === '0') return false;
        }
    }
    return true;
};

BoardConfiguration.prototype.printDops = function () {
    for (let i = 0; i < 9; i++) {
        console.log(this.rows[i]);
    }
    for (let i = 0; i < 9; i++) {
        console.log(this.lines[i]);
    }
    for (let z = 0; z < 9; z++) {
        for (let i = 0; i < 3; i++) {
            console.log(this.cubes[z][i]);
        }
        console.log();
    }
};

//main part
console.log("Format: 0 - empty pos ");
console.log("Example: ");
console.log("___|31_|_2_");
console.log("4__|_8_|_1_");
console.log("9_7|4_2|38_");
console.log("-----------");
console.log("_8_|6_7|9__");
console.log("__6|___|___");
console.log("_43|___|_52");
console.log("-----------");
console.log("865|__4|23_");
console.log("_7_|2_1|895");
console.log("12_|_35|__7");
console.log("is");
console.log("000310020");
console.log("400080010");
console.log("907402380");
console.log("080607900");
console.log("006000000");
console.log("043000052");
console.log("865004230");
console.log("070201895");
console.log("120035007");

console.log("Your Board:")
let board = [];
let isDigit = new Set();
for (let i = 0; i < 10; i++) {
    isDigit.add(i.toString());
}
for (let i = 0; i < 9; i++) {
    board[i] = readLine();
    if (board[i].length === 9)
    for (let j = 0; j < board[i].length; j++) {
        if (!isDigit.has(board[i][j])) {
            throw new WrongInputException();
        }
    }
}

let resolver = new BoardConfiguration(board);
let isSolvable = 0;
while(!resolver.checkIsSolved() && isSolvable < 300) {
    resolver.makeForecast();
    resolver = new BoardConfiguration(resolver.board);
    isSolvable++;
}
if (isSolvable === 300) {
    throw new WrongInputException();
}
console.log("Solution:")
resolver.printBoard();

Exception.prototype = Error.prototype;
function Exception(message) {
    this.message = message;
}
WrongInputException.prototype = Exception.prototype;
function WrongInputException() {
    Exception.call(this, "This board isn't solvable");
}



