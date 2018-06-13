// // Mine Sweeper - Sprint

'use strict'

// CR: Chen
// CR: Nicely done. Had a nice time playing the game.
// ...could have used some constant vars for the smiley images and for the bomb icon

var gClockInterval;
var gBestLevelTime;
var gBoard = [];
var gState = {};
var gLevel = {
    selectedLevel: 1,
    SIZE: 4,
    MINES: 2
};

function levelClicked(elSelected, choice) {
    if (gState.shownCount > 0) return;
    var elLevelElements = document.querySelectorAll('.select-level');
    for (var i = 0; i < elLevelElements.length; i++) {
        elLevelElements[i].classList.remove('selected');
    }
    elSelected.classList.add('selected');
    gLevel.selectedLevel = choice;
    switch (choice) {
        case 1: {
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            gBestLevelTime = localStorage.getItem('bestTimeEasy');
            break;
        }
        case 2: {
            gLevel.SIZE = 6;
            gLevel.MINES = 5;
            gBestLevelTime = localStorage.getItem('bestTimeMedium');
            break;
        }
        case 3: {
            gLevel.SIZE = 8;
            gLevel.MINES = 15;
            gBestLevelTime = localStorage.getItem('bestTimeHard');
            break;
        }
    }
    if (gBestLevelTime != 999999) {
        document.querySelector('.best-time').innerText =
            ('Best Time: ' + gBestLevelTime + ' Sec.');
    } else document.querySelector('.best-time').innerText = ('Best Time:    ');
    initGame();
}

// CR: unless you're restarting a button, this is not a great function name
function restartButton() {
    if (gState.isGameOn) {
        if (confirm('Are you sure?')) {
           restartGame();
        }
    } else restartGame();
}

function restartGame(){
    initGame();
    clearInterval(gClockInterval);
    document.querySelector('.win').classList.remove('show');
    document.querySelector('.smiley').src = "img/smiley-think.png"
}

function renderBoard(board) {
    if (!gState.isGameOn) return;
    var elTable = document.querySelector('.board');
    // CR: htmlStr / strHtml
    var str = '';
    for (var i = 0; i < board.length; i++) {
        str += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = gBoard[i][j];
            str += '<td onclick=cellClicked(this,' + i + ',' + j + ')';
            str += ' oncontextmenu="cellMarked(this,' + i + ',' + j + ')" '
            if (cell.isShown) {
                if (cell.isMarked) {
                    str += ' class="shown flag" >&#x2691</td>';
                } else {
                    // CR: str += ' class="shown b' + cell.bombsAroundCount + '">' + cell.bombsAroundCount + '</td>'
                    switch (cell.bombsAroundCount) {
                        case 0: {
                            str += ' class="shown"></td>';
                            break;
                        }
                        case 1: {
                            str += ' class="shown b1">' + cell.bombsAroundCount + '</td>';
                            break;
                        }
                        case 2: {
                            str += ' class="shown b2">' + cell.bombsAroundCount + '</td>';
                            break;
                        }
                        case 3: {
                            str += ' class="shown b3">' + cell.bombsAroundCount + '</td>';
                            break;
                        }
                        case 4: {
                            str += ' class="shown b4">' + cell.bombsAroundCount + '</td>';
                            break;
                        }
                        case 5:
                        case 6:
                        case 7:
                        case 8: {
                            str += ' class="shown b5">' + cell.bombsAroundCount + '</td>';
                            break;
                        }
                    }
                }
            } else str += '></td>'
        }
        str += '</tr>';
    }
    elTable.innerHTML = str;
    document.querySelector('.mines-left').innerText = gLevel.MINES - gState.markedCount;
    // CR: checkGameOver() does not belong inside the render function
    checkGameOver();
}

function countSurroundingMines(board, iIdx, jIdx) {
    var count = 0;
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
                if (!(i === iIdx && j === jIdx) && board[i][j].isBomb) count++;
            }
        }
    }
    return count;
}

function updateClock() {
    gState.secsPassed = (Date.now() - gState.startTime) / 1000;
    var elClockDisplay = document.querySelector('.clock');
    // CR: or parseInt(gState.secsPassed)
    var str = gState.secsPassed.toString();
    var i = str.indexOf('.');
    str = str.substring(0, i);
    document.querySelector('.time-passed').innerText = str;
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (gState.shownCount === 0) {
        if (cell.isBomb) {
            reshuffleMines(i, j);
            gBoard = setMinesNegsCount(gBoard);
        }
        gState.startTime = Date.now();
        // CR: your clock only shows full seconds,
        //     so setting the interval delay to 1000ms should be enough 
        gClockInterval = setInterval(updateClock, 500);
    }

    if (cell.isMarked) return;

    // CR: Checking the model (i.e. cell.isShown) is preferable
    if (!elCell.classList.contains('shown')) {
        // CR: Good function
        showCell(elCell, i, j);
    }
    if (cell.isBomb) {
        gState.isGameOn = false;
        clearInterval(gClockInterval);
        document.querySelector('.smiley').src = "img/smiley-sad.png"
        revealBombs();
    } else {
        if (cell.bombsAroundCount === 0) expandShown(elCell, i, j);
    }
    renderBoard(gBoard);
}

function cellMarked(elCell, i, j) {
    if (gState.shownCount === 0) return;
    var cell = gBoard[i][j];
    if (cell.isMarked) {
        cell.isMarked = false;
        cell.isShown = false;
        gState.markedCount--;
    } else if (!cell.isShown) {
        cell.isMarked = true;
        // CR: is it shown?
        cell.isShown = true;
        gState.markedCount++;
    }
    renderBoard(gBoard);
}

function revealBombs() {
    var elTable = document.querySelector('.board');
    var str = '';
    for (var i = 0; i < gBoard.length; i++) {
        str += '<tr>';
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isBomb) {
                str += '<td class="shown bomb">&#x1f4a3</td>';
            } else {
                if (cell.isShown) {
                    if (cell.isMarked && !cell.isBomb) {
                        str += '<td class="shown wrong-marked">&#x2691</td>';
                    } else if (cell.bombsAroundCount > 0) {
                        str += '<td class="shown">' + cell.bombsAroundCount + '</td>';
                    } else str += '<td class="shown"></td>';
                }
                else str += '<td></td>'
            }
        }
        str += '</tr>';
    }
    elTable.innerHTML = str;
}

function checkGameOver() {
    if (gState.shownCount + gState.markedCount === gBoard.length * gBoard[0].length &&
        gState.markedCount === gLevel.MINES) {
        document.querySelector('.win').classList.add('show');
        document.querySelector('.smiley').src = "img/smiley-glasses.png"
        switch (gLevel.selectedLevel) {
            case 1: {
                if (gState.secsPassed < localStorage.getItem('bestTimeEasy')) {
                    localStorage.setItem('bestTimeEasy', gState.secsPassed);
                }
                break;
            }
            case 2: {
                if (gState.secsPassed < localStorage.getItem('bestTimeMedium')) {
                    localStorage.setItem('bestTimeMedium', gState.secsPassed);
                }
                break;
            }
            case 3: {
                if (gState.secsPassed < localStorage.getItem('bestTimeHard')) {
                    localStorage.setItem('bestTimeHard', gState.secsPassed);
                }
                break;
            }
        }
        gState.isGameOn = false;
        clearInterval(gClockInterval);
    }
}

function expandShown(elCell, iIdx, jIdx) {
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i >= 0 && i < gBoard.length && j >= 0 && j < gBoard[0].length &&
                !(i === iIdx && j === jIdx)) {
                var cell = gBoard[i][j];
                if (cell.isShown) continue;
                else {
                    // CR: Mind you that elCell refers to the very same td element
                    //     throughout the entire recursion
                    var bombsAround = showCell(elCell, i, j);
                    if (bombsAround === 0) expandShown(elCell, i, j); //  recursion
                }
            }
        }
    }
}

function showCell(elCell, i, j) {
    elCell.classList.add('shown');
    gBoard[i][j].isShown = true;
    gState.shownCount++;
    return gBoard[i][j].bombsAroundCount;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].bombsAroundCount = countSurroundingMines(board, i, j);
        }
    }
    return board;
}

function initGame() {
    gState.isGameOn = false;
    gState.shownCount = 0;
    gState.markedCount = 0;
    gState.secsPassed = 0;
    if (gClockInterval) clearInterval(gClockInterval);
    // CR: Moving all of the bestTime code to a seperate function would be better
    if (!localStorage.getItem('bestTimeEasy')) localStorage.setItem('bestTimeEasy', 999999);
    if (!localStorage.getItem('bestTimeMedium')) localStorage.setItem('bestTimeMedium', 999999);
    if (!localStorage.getItem('bestTimeHard')) localStorage.setItem('bestTimeHard', 999999);
    switch (gLevel.selectedLevel) {
        case 1: {
            gBestLevelTime = localStorage.getItem('bestTimeEasy');
            break;
        }
        case 2: {
            gBestLevelTime = localStorage.getItem('bestTimeMedium');
            break;
        }
        case 3: {
            gBestLevelTime = localStorage.getItem('bestTimeHard');
            break;
        }
    }
    // CR: the 3 'if' statements are redundant, since ls.getItem(key) already returns null if the key
    // .. does not exist, which means that 'if (gBestLevelTime)' or 'if (gBestLevelTime !== null)' should suffice.
    if (gBestLevelTime != 999999) {
        //   CR: wouldn't work well for non floating point numbers (although getting such a number here would be rare)
        // ..CR: converting gBestLevelTime to a Number type and using gBestLevelTime.toFixed(2) would work for integers as well
        var i = gBestLevelTime.indexOf('.');
        gBestLevelTime = gBestLevelTime.substring(0, i + 2);
        document.querySelector('.best-time').innerText =
            ('Best Time: ' + gBestLevelTime + ' Sec.');
    } else document.querySelector('.best-time').innerText = ('Best Time:    ');
    gBoard = buildBoard(0,0);
    gBoard = setMinesNegsCount(gBoard);
    gState.isGameOn = true;
    renderBoard(gBoard);
}


function reshuffleMines(i, j) {
    // CR: Using i and j to statically place a mine in that position 
    //     (within fillRandomMines()) would be a much more efficient solution)
    while (gBoard[i][j].isBomb) {
        gBoard = fillRandomMines(gBoard);
    }
}

function buildBoard(iIdx, jIdx) {
    // CR: iIdx and jIdx are not in use
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                bombsAroundCount: 0,
                isShown: false,
                isBomb: false,
                isMarked: false
            };
        }
    }
    board = fillRandomMines(board);
    return board;
}

function fillRandomMines(board) {
    var len = board.length * board[0].length;
    var mines = [];
    for (var i = 0; i < len; i++) {
        mines[i] = (i < gLevel.MINES) ? true : false;
    }
    shuffle(mines);
    var count = 0;
    var cell = {};
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            cell = board[i][j];
            cell.isBomb = mines[count]; // CR: or mines.shift() / mines.pop()
            count++;
        }
    }
    return board;
}

