"use strict";

function BoardConfiguration() {
    this.configuration = [];
    for (let i = 0; i < 6; i++) {
        this.configuration[i] = [];
    }
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            this.configuration[i][j] = "E";
        }
    }
    this.turn = 0;
}

BoardConfiguration.prototype.changeTurn = function () {
    this.turn = this.turn === 0 ? 1 : 0;
};

BoardConfiguration.prototype.printBoard = function (i, j) {
    for (let i = 0; i < 6; i++) {
        console.log(this.configuration[i]);
    }
    if (this.turn === 0) console.log("Next turn: Player " + i);
    else console.log("Next turn: Player " + j);
    console.log("______");
};

BoardConfiguration.prototype.turnToSign = function () {
    return  this.turn === 0 ? 'X' : 'O';
};

let board;

function Player(kindOfPlayer) {
    this.player = kindOfPlayer;
}

Player.prototype.makeMove = function (i) {
    switch (this.player) {
        case 'computerPlayer':
            computerMove();
            break;
        case 'humanPlayer':
            move(i);
            break;
        case 'randomPlayer':
            randomMove();
            break;
        default:
            throw new KindOfPlayerException();
    }
};

function move(i) {
    let j = 0;
    while (j < 6 && board.configuration[j][i] === 'E')
        j++;
    board.configuration[j - 1][i] = board.turnToSign();
    end = checkResult(j - 1, i);
}

function computerMove() {
    for (let i = 0; i < 7; i++) {
        if (board.configuration[0][i] === 'E') {
            move(i);
            return;
        }
    }
}

function randomMove() {
    let x = Math.floor(Math.random() * Math.floor(7));
    while (board.configuration[0][x] !== 'E') {
        x = Math.floor(Math.random() * Math.floor(7));
    }
    move(x);
}

let result;

function checkResult(x, y) {
    let diag1 = 1;
    let diag2 = 1;
    let row = 1;
    let col = 1;
    let sign = board.turnToSign();
    let i = x;
    let j = y;
    while (i > 0 && j > 0) {
        i--;
        j--;
        if (board.configuration[i][j] !== sign) break;
        diag1++;
    }
    i = x;
    j = y;
    while (i < 5 && j < 6) {
        i++;
        j++;
        if (board.configuration[i][j] !== sign) break;
        diag1++;
    }
    i = x;
    j = y;
    while (i > 0 && j < 6) {
        i--;
        j++;
        if (board.configuration[i][j] !== sign) break;
        diag2++;
    }
    i = x;
    j = y;
    while (i < 5 && j > 0) {
        i++;
        j--;
        if (board.configuration[i][j] !== sign) break;
        diag2++;
    }
    i = x;
    while (i > 0) {
        i--;
        if (board.configuration[i][y] !== sign) break;
        col++;
    }
    i = x;
    while (i < 5) {
        i++;
        if (board.configuration[i][y] !== sign) break;
        col++;
    }
    j = y;
    while (j > 0) {
        j--;
        if (board.configuration[x][j] !== sign) break;
        row++;
    }
    j = y;
    while (j < 6) {
        j++;
        if (board.configuration[x][j] !== sign) break;
        row++;
    }
    if (diag1 >= 4 || diag2 >= 4 || col >= 4 || row >= 4) {
        mainResult = board.turn;
        return true;
    }
    let empty = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (board.configuration[i][j] === "E") empty++;
        }
    }
    if (empty === 0) {
        mainResult = 2;
        return true;
    }
    return false;
}

let mainResult;
let end;
function GameServer(i, j) {
    end = false;
    let Player1 = new Player(kind[i]);
    let Player2 = new Player(kind[j]);
    board = new BoardConfiguration();
    let col;
    while(!end) {
        board.printBoard(i, j);
        if(board.turn === 0 && Player1.player === "humanPlayer" || board.turn === 1 && Player2.player === "humanPlayer") {
            console.log("Input cell number(from 0 to 6) ");
            col = readLine();
            if (col < 0 || col > 6 || board.configuration[0][col] !== "E") {
                console.log("Wrong cell number. Try again. Input cell number(from 0 to 6) ");
                col = readLine();
                if (col < 0 || col > 6 || board.configuration[0][col] !== "E") {
                    throw new ColumnException();
                }
            }
        }
        if (board.turn === 0) Player1.makeMove(col);
        else  Player2.makeMove(col);
        board.changeTurn();
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
        this.statistic[nameToNum[kind[i]]][0]++;
    }
    if (mainResult === 1) {
        console.log("Player " + j + " is WINNER");
        this.turnir[j][i] = 3;
        this.statistic[nameToNum[kind[j]]][0]++;
    }
    if (mainResult === 2) {
        console.log("NO WINNER in this game");
        this.turnir[i][j] = 1;
        this.turnir[j][i] = 1;
    }
    this.statistic[nameToNum[kind[i]]][1]++;
    this.statistic[nameToNum[kind[j]]][1]++;
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

const nameToNum = {
    "computerPlayer": 0,
    "humanPlayer": 1,
    "randomPlayer": 2
}

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
