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
  [0, 4, 8],
  [2, 4, 6],
]

class GameBoard {
  constructor() {
    this.boardState = new Array(9).fill(GAME_STATE.EMPTY);
  }

  resetBoard() {
    this.boardState.fill(GAME_STATE.EMPTY);
  }

  getTileContent(x, y) {
    return this.boardState[x + y * 3];
  }

  getTileContentByIndex(x) {
    return this.boardState[x];
  }

  getBoardState() {
    return this.boardState;
  }

  checkWinner() {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (this.getTileContentByIndex(a) === this.getTileContentByIndex(b) && this.getTileContentByIndex(b) === this.getTileContentByIndex(c) && this.getTileContentByIndex(a) !== GAME_STATE.EMPTY) {
        if (this.getTileContentByIndex(a) === GAME_STATE.X) {
          return RESULT_STATE.X_WIN;
        } else {
          return RESULT_STATE.O_WIN;
        }
      }
    }
    if (this.boardState.every(tile => tile !== GAME_STATE.EMPTY)) {
      return RESULT_STATE.DRAW;
    }
    return RESULT_STATE.IN_PROGRESS;
  }

  printBoard() {
    console.log(`
      ${this.boardState[0]} | ${this.boardState[1]} | ${this.boardState[2]}
      ---------
      ${this.boardState[3]} | ${this.boardState[4]} | ${this.boardState[5]}
      ---------
      ${this.boardState[6]} | ${this.boardState[7]} | ${this.boardState[8]}
    `);
  }

  makeMove(x, y, symbol) {
    if (this.getTileContent(x, y) !== GAME_STATE.EMPTY) {
      return false;
    }
    this.boardState[x + y * 3] = symbol;
    this.printBoard();
    return true;
  }

}

class PlayerManager {
  constructor() {
    this.player1 = {name: "Player 1", symbol: GAME_STATE.X};
    this.player2 = {name: "Player 2", symbol: GAME_STATE.O};
  }

  getPlayer1() {
    return this.player1;
  }
  getPlayer2() {
    return this.player2;
  }
  getPlayer1Name() {
    return this.player1.name;
  }
  getPlayer2Name() {  
    return this.player2.name;
  }
  setPlayer1Name(newName) {
    this.player1.name = newName;
  }
  setPlayer2Name(newName) {
    this.player2.name = newName;
  }
}

class DisplayController {
  constructor() {
    this.boardContainer = document.querySelector(".board");
    this.currentPlayerContainer = document.getElementById("current-player-name");
  }
  updateBoard(boardState) {
    this.boardContainer.querySelectorAll(".tile").forEach((tile, index) => {
      tile.textContent = boardState[index];
    });
  }
  updateCurrentPlayer(currentPlayer) {
    this.currentPlayerContainer.textContent = currentPlayer;
  }
}

const gameBoard = new GameBoard();
const playerManager = new PlayerManager();
const displayController = new DisplayController();

const gameManager = (function () {
  let gameState = RESULT_STATE.IN_PROGRESS;
  let currentPlayer = 0;

  const resetGame = () => {
    gameState = RESULT_STATE.IN_PROGRESS;
    gameBoard.resetBoard();
    currentPlayer = 0;
    displayController.updateCurrentPlayer(playerManager.getPlayer1Name());
    displayController.updateBoard(gameBoard.boardState);
    gameBoard.printBoard();
  }

  const makeMove = (x, y) => {
    if (gameState !== RESULT_STATE.IN_PROGRESS) {
      return;
    }
    if (gameBoard.makeMove(x, y, currentPlayer === 0 ? playerManager.getPlayer1().symbol : playerManager.getPlayer2().symbol)) {
      displayController.updateBoard(gameBoard.boardState);
      currentPlayer = (currentPlayer + 1) % 2;
      displayController.updateCurrentPlayer(currentPlayer === 0 ? playerManager.getPlayer1Name() : playerManager.getPlayer2Name());
      gameState = gameBoard.checkWinner();
      if (gameState !== RESULT_STATE.IN_PROGRESS) {
        if (gameState === RESULT_STATE.DRAW) {
          console.log("Draw!");
          alert("Draw!");
          return;
        } 
        const winner = gameState === RESULT_STATE.X_WIN ? playerManager.getPlayer1Name() : playerManager.getPlayer2Name();
        console.log(`${winner} wins!`);
        alert(`${winner} wins!`);
        return;
      }
    }
  }

  const getCurrentPlayer = () => {
    return currentPlayer === 0 ? playerManager.getPlayer1Name() : playerManager.getPlayer2Name();
  }

  const setPlayer1Name = (newName) => {
    if (currentPlayer === 0) {
      displayController.updateCurrentPlayer(newName);
    }
    playerManager.setPlayer1Name(newName);
  }
  const setPlayer2Name = (newName) => {
    if (currentPlayer === 1) {
      displayController.updateCurrentPlayer(newName);
    }
    playerManager.setPlayer2Name(newName);
  }

  return {resetGame, makeMove, getCurrentPlayer, setPlayer1Name, setPlayer2Name};
})();

document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("click", (event) => {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    gameManager.makeMove(x, y);
  });
});
