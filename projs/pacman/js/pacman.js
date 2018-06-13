var gPacman;
var PACMAN = "&#9786;";
var CHERRY = "%";

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (gState.isGameDone) return;

  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  var degrees;
  switch (eventKeyboard.code) {
    case "ArrowUp":
      var degrees = 270;
      nextLocation.i--;
      break;
    case "ArrowDown":
      degrees = 90;
      nextLocation.i++;
      break;
    case "ArrowLeft":
      degrees = 180;
      nextLocation.j--;
      break;
    case "ArrowRight":
      degrees = 0;
      nextLocation.j++;
      break;
  }

  var nextCell = gBoard[nextLocation.i][nextLocation.j];
  if (nextCell === WALL) return;
  if (nextCell === FOOD) {
    updateScore(1);
  }
  if (nextCell === CHERRY) {
    updateScore(10);
  }

  if (nextCell === SUPER_FOOD && !gPacman.isSuper) {
    gPacman.isSuper = true;
    setTimeout(() => {
      gPacman.isSuper = false;
    }, 5000);
  }

  var isGameOver = checkEngage(nextCell, GHOST);
  if (isGameOver) {
    if (!gPacman.isSuper) return;
    else {
      for (var i = 0; i < gGhosts.length; i++) {
        if (
          gGhosts[i].location.i === nextLocation.i &&
          gGhosts[i].location.j === nextLocation.j
        ) {
          gGhosts[i].isDead = true;
        }
      }
    }
  }
  // update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

  // render updated model to the DOM
  renderCell(gPacman.location, EMPTY);

  // Update the pacman MODEL to new location
  gPacman.location = nextLocation;
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;

  // render updated model to the DOM
  PACMAN =
    '<img src="img/icon.png" style="transform: rotate(' +
    degrees +
    'deg);"></img>';
  renderCell(gPacman.location, PACMAN);
}
