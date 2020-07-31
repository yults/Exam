"use strict";

function Board(x) {
    this.board = [[], []];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 6; j++) {
            this.board[i][j] = x;
        }
    }
    this.kalax = [0, 0];
    this.turn = 0;
}

Board.prototype.changeTurn = function () {
    this.turn = this.turn === 0 ? 1 : 0;
};

Board.prototype.printBoard = function (i, j) {
    console.log("Player's " + i + " kalax : ", this.kalax[0], "   ", "Player's " + j + " kalax: ", this.kalax[1]);
    for (let i = 0; i < 2; i++) {
        console.log(this.board[i]);
    }
    if (this.turn === 0) console.log("Next turn: Player " + i);
    else console.log("Next turn: Player " + j);
    console.log("______");
};

let gameBoard;

function Player(kindOfPlayer) {
    this.player = kindOfPlayer;
}

Player.prototype.makeMove = function (k) {
    switch (this.player) {
        case 'computerPlayer':
            computerMove();
            break;
        case 'humanPlayer':
            move(k);
            break;
        case 'randomPlayer':
            randomMove();
            break;
        default:
            throw new KindOfPlayerException();
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

function move(k) {
    let cnt;
    let turn = gameBoard.turn;
    cnt = gameBoard.board[turn][k];
    gameBoard.board[turn][k] = 0;
    if (turn === 0) {
        while(cnt > 0) {
            for (let j = k - 1; j > -1; j--) {
                gameBoard.board[0][j]++;
                cnt--;
                if (cnt === 0 && gameBoard.board[0][j] === 1 && gameBoard.board[1][j] > 0) {
                    gameBoard.kalax[0] = gameBoard.kalax[0] + 1 + gameBoard.board[1][j];
                    gameBoard.board[0][j] = 0;
                    gameBoard.board[1][j] = 0;
                    return; //захват
                }
            }
            k = 5;
            if (cnt > 0) {
                gameBoard.kalax[0]++;
                cnt--;
            }
            else break;
            if (cnt === 0) return; //захват
            for (let j = 0; j < 6; j++) {
                if (cnt > 0) {
                    gameBoard.board[1][j]++;
                    cnt--;
                }
            }
        }
    } else {
        while(cnt > 0) {
            for (let j = k + 1; j < 6; j++) {
                if (cnt > 0) {
                    gameBoard.board[1][j]++;
                    cnt--;
                }
                if (cnt === 0 && gameBoard.board[1][j] === 1 && gameBoard.board[0][j] > 0) {
                    gameBoard.kalax[1] = gameBoard.kalax[1] + 1 + gameBoard.board[0][j];
                    gameBoard.board[0][j] = 0;
                    gameBoard.board[1][j] = 0;
                    return; //захват
                }
            }
            k = 0;
            if (cnt > 0) {
                gameBoard.kalax[1]++;
                cnt--;
            }
            else break;
            if (cnt === 0) return; //захват
            for (let j = 5; j > -1; j--) {
                if (cnt > 0) {
                    gameBoard.board[0][j]++;
                    cnt--;
                }
            }
        }
    }
    gameBoard.changeTurn();
}

function computerMove() {
    let k;
    if (gameBoard.turn === 0)
    {
        k = 0;
        while (k < 5 && gameBoard.board[0][k] === 0) {
            k++;
        }
        if (k > 5) return;
    }
    if (gameBoard.turn === 1)
    {
        k = 5;
        while (k >= 0 && gameBoard.board[1][k] === 0) {
            k--;
        }
        if (k < 0) return;
    }
    move(k);
}

function randomMove() {
    let k = Math.floor(Math.random() * Math.floor(6));
    while (gameBoard.board[gameBoard.turn][k] === 0) {
        k = Math.floor(Math.random() * Math.floor(6));
    }
    move(k);
}

let result;

function checkResult() {
    let cnt = 0;
    if (gameBoard.kalax[0] > cells * 6 || gameBoard.kalax[1] > cells * 6) return true;
    for (let j = 0; j < 6; j++) {
        if (gameBoard.board[0][j] === 0) cnt++;
    }
    if (cnt === 6)
    {
        for (let j = 0; j < 6; j++) {
            gameBoard.kalax[1] = gameBoard.kalax[1] + gameBoard.board[1][j];
            gameBoard.board[1][j] = 0;
        }
        return true;
    }
    cnt = 0;
    for (let j = 0; j < 6; j++) {
        if (gameBoard.board[1][j] === 0) cnt++;
    }
    if (cnt === 6)
    {
        for (let j = 0; j < 6; j++) {
            gameBoard.kalax[0] = gameBoard.kalax[0] + gameBoard.board[0][j];
            gameBoard.board[0][j] = 0;
        }
        return true;
    }
    return false;
}

function Game(i, j) {
    result = false;
    let Player1 = new Player(kind[i]);
    let Player2 = new Player(kind[j]);
    gameBoard = new Board(cells);
    let cellNum;
    while(!result) {
        gameBoard.printBoard(i, j);
        if(gameBoard.turn === 0 && Player1.player === "humanPlayer" || gameBoard.turn === 1 && Player2.player === "humanPlayer") {
            console.log("Input cell number(from 0 to 5) ");
            cellNum = readLine();
            if (cellNum  < 0 || cellNum  > 5 || gameBoard.board[gameBoard.turn][cellNum] === 0) {
                console.log("Wrong cell number. Try again. Input cell number(from 0 to 5) ");
                cellNum = readLine();
                if (cellNum  < 0 || cellNum  > 5 || gameBoard.board[gameBoard.turn][cellNum] === 0) {
                    throw new CellsNumberException();
                }
            }
        }
        if (gameBoard.turn === 0) Player1.makeMove(cellNum);
        else  Player2.makeMove(cellNum);
        result = checkResult();
    }
    gameBoard.printBoard(i, j);
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
    if (gameBoard.kalax[0] > gameBoard.kalax[1]) {
        console.log("Player " + i +  " is WINNER");
        this.turnir[i][j] = 3;
    }
    if (gameBoard.kalax[0] < gameBoard.kalax[1]) {
        console.log("Player " + j + " is WINNER");
        this.turnir[j][i] = 3;
    }
    if (gameBoard.kalax[0] === gameBoard.kalax[1]) {
        console.log("NO WINNER in this game");
        this.turnir[i][j] = 1;
        this.turnir[j][i] = 1;
    }
};

console.log("Input types of Players : 1 - computer player, 2 - human player, 3 - random player");
for (let i = 0; i < numOfPlayers; i++) {
    console.log("Player's #" + i + " type: ");
    kind[i] = numToName(readLine());
    console.log(kind[i]);
}

let cells;
console.log("Input cells value(from 3 to 6) ");
cells = readLine();
if (cells < 3 || cells > 6) {
    console.log("Wrong value.Try again. Input cells value(from 3 to 6) ");
    cells = readLine();
    if (cells < 3 || cells > 6) {
        throw new CellsNumberException();
    }
}
let table = new Table();
for (let i = 0; i < numOfPlayers; i++) {
    for (let j = i + 1; j < numOfPlayers; j++) {
        console.log("Player " + i + " VS " + "Player " + j);
        Game(i, j);
        table.update(i, j);
        table.printTable();
    }
}

Exception.prototype = Error.prototype;
function Exception(message) {
    this.message = message;
}
CellsNumberException.prototype = Exception.prototype;
function CellsNumberException() {
    Exception.call(this, "Wrong cells' number");
}

KindOfPlayerException.prototype = Exception.prototype;
function KindOfPlayerException() {
    Exception.call(this, "Wrong kind of Player");
}

NumOfPlayerException.prototype = Exception.prototype;
function NumOfPlayerException() {
    Exception.call(this, "Wrong number of Player");
}
