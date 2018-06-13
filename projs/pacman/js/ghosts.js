var GHOST = "&#9781;";

var gIntervalGhosts;
var gGhosts;

function createGhost(board) {
  var ghost = {
    color: getRandomColor(),
    location: {
      i: 3,
      j: 3
    },
    currCellContent: FOOD,
    isDead : false
  };

  gGhosts.push(ghost);
  board[ghost.location.i][ghost.location.j] = GHOST;
}

function createGhosts(board) {
  gGhosts = [];

  createGhost(board);
  createGhost(board);
  createGhost(board);

  gIntervalGhosts = setInterval(function moveGhosts() {
    if (!isFoodLeft()) {
      isGameDone = true;
      document.querySelector(".modal.victory").classList.add("show");
    }

    // TODO, if there are less than 3 ghosts, create one

    gGhosts.forEach(function moveGhost(ghost) {
        if (ghost.isDead) return;
      var nextLocation = {
        i: ghost.location.i + getRandomIntInclusive(-1, 1),
        j: ghost.location.j + getRandomIntInclusive(-1, 1)
      };

      if (board[nextLocation.i][nextLocation.j] === WALL) return;
      if (board[nextLocation.i][nextLocation.j] === GHOST) return;

      var isGameOver = checkEngage(
        board[nextLocation.i][nextLocation.j],
        PACMAN
      );
      if (isGameOver && gPacman.isSuper) {
          console.log('KILLING MONSTER');
          ghost.isDead = true;
      }

      // set back what we stepped on
      board[ghost.location.i][ghost.location.j] = ghost.currCellContent;
      renderCell(ghost.location, ghost.currCellContent);

      if (! ghost.isDead) {
      // move the ghost
      ghost.location = nextLocation;

      // keep the contnet of the cell we are going to
      ghost.currCellContent = board[ghost.location.i][ghost.location.j];

      // move the ghost model and update dom
      board[ghost.location.i][ghost.location.j] = GHOST;
      renderCell(ghost.location, getGhostHTML(ghost));
      }
    });
  }, 600);
}

function getGhostHTML(ghost) {
  if (gPacman.isSuper) {
      return `<span style="color: yellow; background-color:blue">${GHOST}</span>`;
  }  else return '<span style="color: ' + ghost.color + '" >' + GHOST + '</span>';
}
