"use strict";

function BoardConfiguration() {
    this.configuration = [];
    for (let i = 0; i < 8; i++) {
        this.configuration[i] = [];
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            this.configuration[i][j] = "_";
        }
    }
    this.configuration[3][3] = "W";
    this.configuration[3][4] = "B";
    this.configuration[4][3] = "B";
    this.configuration[4][4] = "W";
    this.turn = 0;
    this.score = [2, 2];
}

BoardConfiguration.prototype.changeTurn = function () {
    this.turn = this.turn === 0 ? 1 : 0;
};
BoardConfiguration.prototype.clearNums = function () {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++)
        {
            if (board.configuration[i][j] !== "B" && board.configuration[i][j] !== "W")
                board.configuration[i][j] = "_";
        }
    }
};

BoardConfiguration.prototype.printBoard = function (i, j) {
    console.log("  a b c d e f g h");
    for (let i = 1; i < 9; i++) {
        console.log(i + " " + this.configuration[i - 1]);
    }
    if (this.turn === 0) console.log("Next turn: Player " + i + "- Black");
    else console.log("Next turn: Player " + j + "- White");
    console.log("Score: Player #" + i + " - " + board.score[0] + "          Player #" + i + " - " + board.score[1]);
    console.log("______");
};

BoardConfiguration.prototype.turnToSign = function () {
    return  this.turn === 0 ? "B" : "W";
};

BoardConfiguration.prototype.altTurnToSign = function () {
    return  this.turn === 0 ? "W" : "B";
};

let board;

function Player(kindOfPlayer) {
    this.player = kindOfPlayer;
}

Player.prototype.makeMove = function (variant) {
    switch (this.player) {
        case 'computerPlayer':
            computerMove();
            break;
        case 'humanPlayer':
            move(variant);
            break;
        case 'randomPlayer':
            randomMove();
            break;
        default:
            throw new KindOfPlayerException();
    }
};

function move(x) {
    x--;
    board.configuration[path[x][0]][path[x][1]] = board.turnToSign();
    reverser(path[x][0], path[x][1]);
}

function computerMove() {
    move(1);
}

function randomMove() {
    let x = Math.floor(Math.random() * Math.floor(cntOfVariants - 1));
    move(x + 1);
}

function reverser(x, y) {
    let altSign = board.altTurnToSign();
    for (let i = 0; i < 8; i++) {
        if (validPosition(x + iMove[i], y + jMove[i]) && board.configuration[x + iMove[i]][y + jMove[i]] === altSign) {
            color(x, y, iMove[i], jMove[i]);
        }
    }
}

function color(x, y, i, j) {
    let x1 = x;
    let y1 = y;
    x += i;
    y += j;
    while(validPosition(x, y) && board.configuration[x][y] === board.altTurnToSign())
    {
        x += i;
        y += j;
    }
    if (validPosition(x, y) && board.configuration[x][y] === board.turnToSign()) {
        while (x !== x1 || y !== y1)
        {
            x -= i;
            y -= j;
            board.configuration[x][y] = board.turnToSign();
        }
    }
}

let boardOfMoves;
let cntOfVariants;
let noMovesFlag;
function findTurnsSigns() {
    cntOfVariants = 1;
    path = [];
    let sign = board.turnToSign();
    boardOfMoves = Object.create(board);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board.configuration[i][j] === sign) findPossibleMoves(i, j);
        }
    }
    if (cntOfVariants === 1 && noMovesFlag) return false;
    if (cntOfVariants === 1) {
        noMovesFlag = true;
        console.log("No moves for this Player");
        board.changeTurn();
        findTurnsSigns();
    }
    noMovesFlag = false;
    return true;
}

const iMove = [0, 0, 1, 1, 1, -1, -1, -1];
const jMove = [1, -1, 0, 1, -1, 0, 1, -1];
let ppi, ppj;
let path = [];
function findPossibleMoves(x, y) {
    let sign = board.altTurnToSign();
    for (let i = 0; i < 8; i++) {
        if (validPosition(x + iMove[i], y + jMove[i]) && board.configuration[x + iMove[i]][y + jMove[i]] === sign) {
            if (possiblePosition(x, y, iMove[i], jMove[i])) {
                boardOfMoves.configuration[ppi][ppj] = cntOfVariants;
                path[cntOfVariants - 1] = [ppi, ppj];
                cntOfVariants++;
            }
        }
    }
}

function possiblePosition(x, y, i, j) {
    let sign = board.altTurnToSign();
    x += i;
    y += j;
    while(validPosition(x, y) && board.configuration[x][y] === sign)
    {
        x += i;
        y += j;
    }
    if (validPosition(x, y) && board.configuration[x][y] === "_") {
        ppi = x;
        ppj = y;
        return true;
    }
    return false;
}

function validPosition(i, j) {
    return (i >= 0 && j >= 0 && i < 8 && j < 8);
}

function GameServer(i, j) {
    noMovesFlag = false;
    let Player1 = new Player(kind[i]);
    let Player2 = new Player(kind[j]);
    board = new BoardConfiguration();
    let variant;
    while(findTurnsSigns()) {
        noMovesFlag = false;
        boardOfMoves.printBoard(i, j);
        if(board.turn === 0 && Player1.player === "humanPlayer" || board.turn === 1 && Player2.player === "humanPlayer") {
            console.log("Input num of Variant");
            variant = readLine();
            if (variant < 1 || variant > cntOfVariants - 1) {
                console.log("Wrong variant. Try again. Input number from 1 to " + cntOfVariants);
                variant = readLine();
                if (variant < 1 || variant > cntOfVariants - 1) {
                    throw new ColumnException();
                }
            }
        }
        if (board.turn === 0) Player1.makeMove(variant);
        else  Player2.makeMove(variant);
        board.changeTurn();
        board.clearNums();
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
    if (board.score[0] > board.score[1]) {
        console.log("Player " + i +  " is WINNER");
        this.turnir[i][j] = 3;
        this.statistic[nameToNum[kind[i]]][0]++;
    }
    if (board.score[0] < board.score[1]) {
        console.log("Player " + j + " is WINNER");
        this.turnir[j][i] = 3;
        this.statistic[nameToNum[kind[j]]][0]++;
    }
    if (board.score[0] === board.score[1]) {
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


