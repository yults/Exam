"use strict";

function BoardConfiguration(board) {
    this.cubes = [];
    this.board = [];
    for (let i = 0; i < 9; i++) {
        this.board[i] = [];
        for (let j = 0; j < 9; j++) {
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

BoardConfiguration.prototype.perebor = function (x0, y0) {
    console.log(x0 + ' ' + y0);
    this.printBoard();
    let mmm = readLine();
    let x = x0, y = y0;
    let step = 1;
    while (x < 9 && this.board[x][y] !== '0') {
        if (y === 8) {
            x++;
            y = 0;
        }
        else y++;
    }
    if (x === 9 || this.checkIsSolved()) return true;
    this.board[x][y] = step.toString();
    this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][x % 3][y % 3] = step.toString();
    while (!this.checkIsCorrect(x, y) && step < 10) {
        step++;
        if (step === 10) {
            this.board[x][y] = '0';
            this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][x % 3][y % 3] = '0';
            return false;
        }
        this.board[x][y] = step.toString();
        this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][x % 3][y % 3] = step.toString();
    }
    while(!this.checkIsSolved()) {
        while (!this.perebor(x, y)) {
            step++;
            this.printBoard();
            this.board[x][y] = step.toString();
            this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][x % 3][y % 3] = step.toString();
            while (!this.checkIsCorrect(x, y) && step < 10) {
                step++;
                if (step === 10) {
                    this.board[x][y] = '0';
                    this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][x % 3][y % 3] = '0';
                    return false;
                }
                this.board[x][y] = step.toString();
                this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][x % 3][y % 3] = step.toString();
            }
        }
    }
    return true;
}

BoardConfiguration.prototype.checkIsCorrect = function (x, y) {
    let inRow = new Set();
    let inCube = new Set();
    let inLine = new Set();
    for (let i = 0; i < 9; i++) {
        if (inRow.has(this.board[x][i])) return false;
        if (this.board[x][i] !== '0') inRow.add(this.board[x][i]);
    }
    for (let i = 0; i < 9; i++) {
        if (inLine.has(this.board[i][y])) return false;
        if (this.board[i][y] !== '0') inLine.add(this.board[i][y]);
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (inCube.has(this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][i][j])) return false;
            if (this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][i][j] !== '0'){
                inCube.add(this.cubes[Math.floor(x / 3) * 3 + Math.floor(y / 3)][i][j]);
            }
        }
    }
    return true;
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
    if (board[i].length === 9) {
        for (let j = 0; j < board[i].length; j++) {
            if (!isDigit.has(board[i][j])) {
                throw new WrongInputException();
            }
        }
    }
    else {
        throw new WrongInputException();
    }
}

let resolver = new BoardConfiguration(board);
resolver.perebor(0, 0);
console.log("Solution:");
resolver.printBoard();
Exception.prototype = Error.prototype;
function Exception(message) {
    this.message = message;
}
WrongInputException.prototype = Exception.prototype;
function WrongInputException() {
    Exception.call(this, "This board isn't solvable");
}





