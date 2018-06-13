"use strict";
var WALL = "#";
var FOOD = ".";
var EMPTY = " ";
var SUPER_FOOD = "$";

var gBoard;
var gState = {
  score: 0,
  isGameDone: false
};

function init() {
  gBoard = buildBoard();
  printMat(gBoard, ".boardContainer");
  var cherryInterval = setInterval(addCherry,4000);
}

function restartGame() {
  var elButton = document.querySelectorAll('.modal');
  for (var i=0; i<elButton.length; i++) {
    elButton[i].classList.remove('show');
  }
  gState.score = 0;
  gState.isGameDone = false;
  init();
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;
      if (
        i === 0 ||
        i === SIZE - 1 ||
        j === 0 ||
        j === SIZE - 1 ||
        (j == 3 && i > 4 && i < SIZE - 2)
      ) {
        board[i][j] = WALL;
      }
    }
  }

  board[1][1] = SUPER_FOOD;
  board[1][board[0].length - 2] = SUPER_FOOD;
  board[board.length - 2][board[0].length - 2] = SUPER_FOOD;
  board[board.length - 2][1] = SUPER_FOOD;

  createPacman(board);
  createGhosts(board);
  return board;
}

function addCherry() {
  var iLocation = getRandomIntInclusive(1, gBoard.length - 2);
  var jLocation = getRandomIntInclusive(1, gBoard[0].length - 2);
  while (gBoard[iLocation][jLocation] !== FOOD && gBoard[iLocation][jLocation] !== EMPTY ) {
    var iLocation = getRandomIntInclusive(1, gBoard.length - 2);
    var jLocation = getRandomIntInclusive(1, gBoard[0].length - 2);
  }
  gBoard[iLocation][jLocation] = CHERRY;
  var cell = {
    i: iLocation,
    j: jLocation
  };
  var str = '<img src="img/cherry.png" ></img>';
  renderCell(cell, str);
}

function isFoodLeft() {
  var count = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === FOOD) return true;
    }
  }
  return false;
}

// This function is called from both pacman and ghost to check engage
function checkEngage(cell, opponent) {
  if (cell === opponent) {
    if (gPacman.isSuper) {
      if (cell === opponent) {
        return true;
      }
    } else {
      clearInterval(gIntervalGhosts);
      gState.isGameDone = true;
      document.querySelector(".modal.game-over").classList.add("show");
      return true;
    }
  }
  return false;
}

// this function updates both the model and the dom for the score
function updateScore(value) {
  gState.score += value;
  document.querySelector("header > h3 > span").innerText = gState.score;
}
