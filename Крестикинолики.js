"use strict";

function BoardConfiguration(x) {
    this.configuration = [];
    this.size = x;
    for (let i = 0; i < x; i++) {
        this.configuration[i] = [];
    }
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < x; j++) {
            this.configuration[i][j] = "E";
        }
    }
    this.turn = 0;
}

BoardConfiguration.prototype.changeTurn = function () {
    this.turn = this.turn === 0 ? 1 : 0;
};

BoardConfiguration.prototype.turnToSign = function () {
    return  this.turn === 0 ? 'X' : 'O';
};

BoardConfiguration.prototype.printBoard = function (i, j) {
    for (let i = 0; i < this.size; i++) {
        console.log(this.configuration[i]);
    }
    if (this.turn === 0) console.log("Next turn: Player " + i);
    else console.log("Next turn: Player " + j);
    console.log("______");
};

let board;

function Player(kindOfPlayer) {
    this.player = kindOfPlayer;
}

Player.prototype.makeMove = function (i, j) {
    switch (this.player) {
        case 'computerPlayer':
            computerMove();
            break;
        case 'humanPlayer':
            move(i, j);
            break;
        case 'randomPlayer':
            randomMove();
            break;
        default:
            throw new KindOfPlayerException();
    }
};

function move(i, j) {
    board.configuration[i][j] = board.turnToSign();
}

function computerMove() {
    for (let i = 0; i < board.size; i++) {
        for (let j = 0; j < board.size; j++) {
            if (board.configuration[i][j] === 'E') {
                move(i, j);
                return;
            }
        }
    }
}

function randomMove() {
    let x = Math.floor(Math.random() * Math.floor(board.size));
    let y = Math.floor(Math.random() * Math.floor(board.size));
    while (board.configuration[x][y] !== 'E') {
        x = Math.floor(Math.random() * Math.floor(board.size));
        y = Math.floor(Math.random() * Math.floor(board.size));
    }
    move(x, y);
}

let result;

function checkResult() {
    let diag1 = 0;
    let diag2 = 0;
    let empty = 0;
    let sign = board.turnToSign();
    console.log(board.turnToSign());
    for (let i = 0; i < board.size; i++) {
        let row = 0;
        let col  = 0;
        for (let j = 0; j < board.size; j++) {
            if (board.configuration[i][j] === sign) {
                row++;
            }
            if (board.configuration[j][i] === sign) {
                col++;
            }
            if (board.configuration[i][j]=== 'E') {
                empty++;
            }
        }
        if (row == board.size || col == board.size) {
            return board.turn;
        }
        if (board.configuration[i][i] === sign) {
            diag1++;
        }
        if (board.configuration[i][board.size - 1 - i] === sign) {
            diag2++;
        }
    }
    if (diag1 == board.size || diag2 == board.size) {
        return board.turn;
    }
    if (empty === 0) {
        board.changeTurn();
        return 2;
    }
    board.changeTurn();
    return -1;
}
let mainResult;
let n;
console.log("Input board's size");
n = readLine();
if (n < 3 || n > 5) {
    console.log("Wrong number. Try again");
    n = readLine();
    if (n < 3 || n > 5) {
        throw new NumOfPlayerException();
    }
}
function GameServer(i, j) {
    let end = false;
    let Player1 = new Player(kind[i]);
    let Player2 = new Player(kind[j]);
    board = new BoardConfiguration(n);
    let row, col;
    while(!end) {
        board.printBoard(i, j);
        if(board.turn === 0 && Player1.player === "humanPlayer" || board.turn === 1 && Player2.player === "humanPlayer") {
            console.log("Input row(from 0 to " + board.size + " ");
            row = readLine();
            console.log("Input column(from 0 to " + board.size + " ");
            col = readLine();
            if (row < 0 || row > board.size - 1 || board.configuration[row][col] !== "E" || col < 0 || col > board.size - 1) {
                console.log("Wrong");
                row = readLine();
                col = readLine();
                if (row < 0 || row > board.size - 1 || board.configuration[row][col] !== "E" || col < 0 || col > board.size - 1) {
                    throw new ColumnException();
                }
            }
        }
        if (board.turn === 0) Player1.makeMove(row, col);
        else  Player2.makeMove(row, col);
        mainResult = checkResult();
        if (mainResult >= 0) end = true;
    }
    board.printBoard(i, j);
}

//main part
let numOfPlayers;
console.log("Input number of players");
numOfPlayers = readLine();
if (numOfPlayers < 2) {
    console.log("Wrong number. Try again");
    numOfPlayers = readLine();
    if (numOfPlayers < 2) {
        throw new NumOfPlayerException();
    }
}

let kind = [];

function Table() {
    this.turnir = [];
    for (let i = 0; i < numOfPlayers; i++) {
        this.turnir[i] = [];
    }
    for (let i = 0; i < numOfPlayers; i++) {
        for (let j = 0; j < numOfPlayers; j++) {
            this.turnir[i][j] = 0;
        }
    }
    this.statistic = [];
    for (let i = 0; i < 4; i++) {
        this.statistic[i] = [0, 0];
    }
}

Table.prototype.printTable = function () {
    let players = [];
    for (let i = 0; i < numOfPlayers; i++)
        players[i] = i;
    console.log("TURNIR TABLE");
    console.log("   " + players + " result");
    for (let i = 0; i < numOfPlayers; i++) {
        let res = 0;
        for (let j = 0; j < numOfPlayers; j++) {
            res += this.turnir[i][j];
        }
        console.log(i + "| " + this.turnir[i] + "| " + res);
    }
};

Table.prototype.update = function (i, j) {
    if (mainResult === 0) {
        console.log("Player " + i +  " is WINNER");
        this.turnir[i][j] = 3;
        this.statistic[nameToNum(kind[i])][0]++;
    }
    if (mainResult === 1) {
        console.log("Player " + j + " is WINNER");
        this.turnir[j][i] = 3;
        this.statistic[nameToNum(kind[j])][0]++;
    }
    if (mainResult === 2) {
        console.log("NO WINNER in this game");
        this.turnir[i][j] = 1;
        this.turnir[j][i] = 1;
    }
    this.statistic[nameToNum(kind[i])][1]++;
    this.statistic[nameToNum(kind[j])][1]++;
};

Table.prototype.printStatistic = function () {
    console.log("Persent of Wins:");
    for (let i = 0; i < 3; i++) {
        if (this.statistic[i][1] === 0) {
            console.log(i + 1 + " : no games");
        } else {
            console.log(i + 1 + ": " + this.statistic[i][0] * 100 / this.statistic[i][1] + "%");
        }
    }
};

function numToName(x) {
    switch (x) {
        case '1':
            return 'computerPlayer';
            break;
        case '2':
            return 'humanPlayer';
            break;
        case '3':
            return 'randomPlayer';
            break;
        default:
            throw new KindOfPlayerException();
    }
}

function nameToNum(x) {
    switch (x) {
        case 'computerPlayer':
            return 0;
            break;
        case 'humanPlayer':
            return 1;
            break;
        case 'randomPlayer':
            return 2;
            break;
        default:
            throw new KindOfPlayerException();
    }
}

console.log("Input types of Players : 1 - computer player, 2 - human player, 3 - random player");
for (let i = 0; i < numOfPlayers; i++) {
    console.log("Player's #" + i + " type: ");
    kind[i] = numToName(readLine());
    console.log(kind[i]);
}

let table = new Table();
for (let i = 0; i < numOfPlayers; i++) {
    for (let j = i + 1; j < numOfPlayers; j++) {
        console.log("Player " + i + " VS " + "Player " + j);
        GameServer(i, j);
        table.update(i, j);
        table.printTable();
    }
}
table.printStatistic();

Exception.prototype = Error.prototype;
function Exception(message) {
    this.message = message;
}
ColumnException.prototype = Exception.prototype;
function ColumnException() {
    Exception.call(this, "Column full or not exists");
}

KindOfPlayerException.prototype = Exception.prototype;
function KindOfPlayerException() {
    Exception.call(this, "Wrong kind of Player");
}

NumOfPlayerException.prototype = Exception.prototype;
function NumOfPlayerException() {
    Exception.call(this, "Wrong number of Players");
}
