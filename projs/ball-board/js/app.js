var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';

var gGamerPos = { i: 2, j: 9 };
var gBoard = buildBoard();
var gCollectedBalls = 0;
var gGameOn = true;
var gInterval1;
renderBoard(gBoard);

function restartGame() {
	init();
	gBoard = buildBoard();
	renderBoard(gBoard);
	gGameOn = true;
	document.querySelector('.won').style.display = 'none';
	gCollectedBalls = 0;
	renderCollectedBalls();
}

function init() {
	gInterval1 = setInterval(addRandomBall, 3000);
}

function addRandomBall() {
	var iIdx = gGamerPos.i;
	var jIdx = gGamerPos.j;
	var count = 0;
	while ((gGamerPos.i === iIdx && gGamerPos.j === jIdx) ||
							gBoard[iIdx][jIdx].gameElement ||
							gBoard[iIdx][jIdx].type === WALL) {
		count++
		iIdx = Math.floor(Math.random() * (gBoard.length));
		jIdx = Math.floor(Math.random() * (gBoard[0].length));
		if (count > 100) return;
	}
	gBoard[iIdx][jIdx].gameElement = BALL;
	renderBoard(gBoard);
}

function buildBoard() {
	// Create the Matrix
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}

	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = {
				type: FLOOR,
				gameElement: null
			};

			// Place Walls at edges
			if (i == 0 || i == board.length - 1 || j == 0 || j == board[0].length - 1) {
				cell.type = WALL;

			}
			board[i][j] = cell;
		}
	}

	board[0][5].type = FLOOR;
	board[9][5].type = FLOOR;
	board[5][0].type = FLOOR;
	board[5][11].type = FLOOR;

	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

function areNoBalls() {
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (gBoard[i][j].gameElement === BALL) return false;
		}
	}
	return true;
}

function renderCollectedBalls() {
	var elCollected = document.querySelector('.collected-balls');
	elCollected.innerText = 'Collected: ' + gCollectedBalls + ' Balls';
}

// Render the board to an HTML table
function renderBoard(board) {
	var elBoard = document.querySelector('.board');
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];
			var cellClass = getClassName({ i: i, j: j })
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j, isJumping) {
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	if (gGamerPos.i === 0 && i === 9) isJumping = true;
	if (gGamerPos.i === 9 && i === 0) isJumping = true;
	if (gGamerPos.j === 0 && j === 11) isJumping = true;
	if (gGamerPos.j === 11 && j === 0) isJumping = true;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || isJumping) {

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!', gCollectedBalls);
			gCollectedBalls++;
			targetCell.gameElement = null;
			renderCollectedBalls();
			if (areNoBalls()) {
				gGameOn = false;
				document.querySelector('.won').style.display = 'block';
				document.querySelector('button').style.display = 'block';
				clearInterval(gInterval1);
			}
		}

		// MOVING
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	console.log('event/n',event);
	
	var i = gGamerPos.i;
	var j = gGamerPos.j;
	var isJumping = true;
	if (gGamerPos.i === 0 && event.key === 'ArrowUp') {
		moveTo(9, j, isJumping);
		return;
	}
	if (gGamerPos.i === 9 && event.key === 'ArrowDown') {
		moveTo(0, j, isJumping);
		return;
	}
	if (gGamerPos.j === 0 && event.key === 'ArrowLeft') {
		moveTo(i, 11, isJumping);
		return;
	}
	if (gGamerPos.j === 11 && event.key === 'ArrowRight') {
		moveTo(i, 0, isJumping);
		return;
	}
	
	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;
	}
	
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

