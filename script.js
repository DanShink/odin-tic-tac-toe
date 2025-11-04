const GAME_STATE = {
  X: "X",
  O: "O",
  EMPTY: " ",
}

const RESULT_STATE = {
  X_WIN: "X_WIN",
  O_WIN: "O_WIN",
  DRAW: "DRAW",
  IN_PROGRESS: "IN_PROGRESS",
}

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
]

const gameBoard = (function () {
  const boardState = new Array(9).fill(GAME_STATE.EMPTY);

  const resetBoard = () => {
    boardState.fill(GAME_STATE.EMPTY);
  }

  const getTileContent = (x, y) => {
    return boardState[x + y * 3]
  }

  const getTileContentByIndex = (x) => {
    return boardState[x];
  }

  const checkWinner = () => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (getTileContentByIndex(a) === getTileContentByIndex(b) && getTileContentByIndex(b) === getTileContentByIndex(c) && getTileContentByIndex(a) !== GAME_STATE.EMPTY) {
        if (getTileContentByIndex(a) === GAME_STATE.X) {
          return RESULT_STATE.X_WIN;
        } else {
          return RESULT_STATE.O_WIN;
        }
      }
    }
    if (boardState.every(tile => tile !== GAME_STATE.EMPTY)) {
      return RESULT_STATE.DRAW;
    }
    return RESULT_STATE.IN_PROGRESS;
  }

  const printBoard = () => {
    console.log(`
      ${boardState[0]} | ${boardState[1]} | ${boardState[2]}
      ---------
      ${boardState[3]} | ${boardState[4]} | ${boardState[5]}
      ---------
      ${boardState[6]} | ${boardState[7]} | ${boardState[8]}
    `);
  }

  const makeMove = (x, y, symbol) => {
    if (getTileContent(x, y) !== GAME_STATE.EMPTY) {
      return false;
    }
    boardState[x + y * 3] = symbol;
    printBoard();
    return true;
  }

  return {boardState, resetBoard, getTileContent, makeMove, checkWinner, printBoard};
})();

const playerManager = (function () {
  const createPlayer = (name, symbol) => {
    const setName = (newName) => {
      name = newName;
    }
    return {name, symbol, setName};
  }

  const player1 = createPlayer("Player 1", GAME_STATE.X);
  const player2 = createPlayer("Player 2", GAME_STATE.O);

  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const setPlayer1Name = (newName) => {
    player1.setName(newName);
  }
  const setPlayer2Name = (newName) => {
    player2.setName(newName);
  }

  const resetPlayers = () => {
    const player1Name = document.getElementById("player1-name").textContent;
    const player2Name = document.getElementById("player2-name").textContent;
    setPlayer1Name(player1Name);
    setPlayer2Name(player2Name);
  }

  return {getPlayer1, getPlayer2, setPlayer1Name, setPlayer2Name, resetPlayers};
})();

const displayController = (function () {
  const boardContainer = document.querySelector(".board");
  const updateBoard = (boardState) => {
    boardContainer.querySelectorAll(".tile").forEach((tile, index) => {
      tile.textContent = boardState[index];
    });
  }

  return {updateBoard};
})();

const gameManager = (function () {
  let gameState = RESULT_STATE.IN_PROGRESS;
  let currentPlayer = 0;

  const resetGame = () => {
    gameState = RESULT_STATE.IN_PROGRESS;
    gameBoard.resetBoard();
    currentPlayer = 0;
    playerManager.resetPlayers();
    displayController.updateBoard(gameBoard.boardState);
    gameBoard.printBoard();
  }

  const makeMove = (x, y) => {
    if (gameState !== RESULT_STATE.IN_PROGRESS) {
      return;
    }
    if (gameBoard.makeMove(x, y, currentPlayer === 0 ? playerManager.getPlayer1().symbol : playerManager.getPlayer2().symbol)) {
      currentPlayer = (currentPlayer + 1) % 2;
      displayController.updateBoard(gameBoard.boardState);
      gameState = gameBoard.checkWinner();
      if (gameState !== RESULT_STATE.IN_PROGRESS) {
        if (gameState === RESULT_STATE.DRAW) {
          console.log("Draw!");
          return;
        } 
        const winner = gameState === RESULT_STATE.X_WIN ? playerManager.getPlayer1().name : playerManager.getPlayer2().name;
        console.log(`${winner} wins!`);
        return;
      }
    }
  }

  return {resetGame, makeMove};
})();

