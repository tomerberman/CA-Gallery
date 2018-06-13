'use strict'

// Pieces Types
var KING_WHITE = '♔';
var QUEEN_WHITE = '♕';
var ROOK_WHITE = '♖';
var BISHOP_WHITE = '♗';
var KNIGHT_WHITE = '♘';
var PAWN_WHITE = '♙';
var KING_BLACK = '♚';
var QUEEN_BLACK = '♛';
var ROOK_BLACK = '♜';
var BISHOP_BLACK = '♝';
var KNIGHT_BLACK = '♞';
var PAWN_BLACK = '♟';

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < 8; i++) {
        board[i] = [];
        for (var j = 0; j < 8; j++) {
            var piece = ''
            if (i === 1) piece = PAWN_BLACK;
            else if (i === 6) piece = PAWN_WHITE;
            board[i][j] = piece;
        }
    }

    board[4][4] = BISHOP_BLACK;

    board[0][0] = board[0][7] = ROOK_BLACK;
    board[0][1] = board[0][6] = KNIGHT_BLACK;
    board[0][2] = board[0][5] = BISHOP_BLACK;
    board[0][3] = KING_BLACK;
    board[0][4] = QUEEN_BLACK;

    board[7][0] = board[7][7] = ROOK_WHITE;
    board[7][1] = board[7][6] = KNIGHT_WHITE;
    board[7][2] = board[7][5] = BISHOP_WHITE;
    board[7][3] = KING_WHITE;
    board[7][4] = QUEEN_WHITE;

    // console.table(board);
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            var className = ((i + j + 1) % 2 === 0) ? 'black' : 'white';
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" ' +
                'class="    ' + className + '">' + cell + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.gameBoard');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {

    if (gSelectedElCell && elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell);
        cleanBoard();
        return;
    }

    cleanBoard();
    // if (gSelectedElCell) {
    // gSelectedElCell.classList.remove('selected');
    // gSelectedElCell = null;
    // }

    elCell.classList.add('selected');
    gSelectedElCell = elCell;

    // console.log('elCell.id: ', elCell.id);
    var cellCoord = getCellCoord(elCell.id);
    var piece = elCell.innerText;
    var possibleCoords = [];
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord);
            break;
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord);
            break;
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord);
            break;
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;

    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
    var fromCoord = getCellCoord(elFromCell.id);
    var toCoord = getCellCoord(elToCell.id);
    var piece = gBoard[fromCoord.i][fromCoord.j];

    gBoard[fromCoord.i][fromCoord.j] = '';
    gBoard[toCoord.i][toCoord.j] = piece;
    elToCell.innerText = piece;
    elFromCell.innerText = '';
}

function markCells(coords) {
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var selector = getSelector(coord);
        var elCell = document.querySelector(selector);
        elCell.classList.add('mark');
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    coord.i = +strCellId.substring(5, strCellId.lastIndexOf('-'));
    coord.j = +strCellId.substring(strCellId.lastIndexOf('-') + 1);
    // console.log('coord', coord);
    return coord;
}

function cleanBoard() {
    var tds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < tds.length; i++) {
        tds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}


function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];
    var diff = 1;
    if (isWhite) diff = -diff;
    var coord = { i: pieceCoord.i + diff, j: pieceCoord.j }

    if (!isEmptyCell(coord)) return res;
    res.push(coord)

    if (isWhite && pieceCoord.i === 6 || !isWhite && pieceCoord.i === 1) {
        diff = 2;
        if (isWhite) diff = -diff;
        coord = { i: pieceCoord.i + diff, j: pieceCoord.j }
        if (isEmptyCell(coord)) res.push(coord)
    }
    return res;
}



function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];

    var i = pieceCoord.i;
    for (var idx = pieceCoord.j + 1; idx < 8; idx++) {
        var coord = { i: i, j: idx }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
        var coord = { i: i, j: idx }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    var j = pieceCoord.j;
    for (var idx = pieceCoord.i + 1; idx < 8; idx++) {
        var coord = { i: idx, j: j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var idx = pieceCoord.i - 1; idx >= 0; idx--) {
        var coord = { i: idx, j: j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i - 1;
    for (idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }

    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];
    for (var i = pieceCoord.i - 2; i <= pieceCoord.i + 2; i++) {
        for (var j = pieceCoord.j - 2; j <= pieceCoord.j + 2; j++) {
            if (i >= 0 && i < 8 && j >= 0 && j < 8) {
                var iDist = Math.abs(pieceCoord.i - i);
                var jdist = Math.abs(pieceCoord.j - j);
                var coord = { i: i, j: j };
                if ((iDist === 2 && jdist === 1 || iDist === 1 && jdist === 2) && isEmptyCell(coord)) {
                    res.push(coord);
                }
            }
        }
    }
    return res;
}




// Not checking Cell empty
// function getAllPossibleCoordsBishopSimple(pieceCoord) {
//     var res = [];
//     for (var i = 0; i < gBoard.length; i++) {
//         var row = gBoard[i];
//         for (var j = 0; j < row.length; j++) {
//             var cell = row[j];

//             if (i === pieceCoord.i && j === pieceCoord.j) continue;

//             if (pieceCoord.i + pieceCoord.j === i + j ||
//                 pieceCoord.i - pieceCoord.j === i - j) {
//                 res.push({ i: i, j: j });
//             }
//         }
//     }
//     return res;
// }

// Not checking if cell is empty
// function getAllPossibleCoordsRookSimple(pieceCoord) {
//     var res = [];
//     for (var idx = 0; idx < gBoard.length; idx++) {
//         // Dont mark the clicked cell
//         if (idx !== pieceCoord.j) {
//             //push all cells in the same row  
//             res.push({ i: pieceCoord.i, j: idx });
//         }
//         if (idx !== pieceCoord.i) {
//             //push all cells in the same col  
//             res.push({ i: idx, j: pieceCoord.j });
//         }
//     }
//     return res;
// }
