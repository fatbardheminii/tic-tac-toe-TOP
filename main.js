//store important variables inside object and access them everywhere
const sharedVariables = {
  //game mode variables
  board: document.querySelector(".board"),
  boardArr: ["", "", "", "", "", "", "", "", ""],
  cells: document.querySelectorAll(".cell"),
  gameMode: document.querySelector(".game-mode"),
  turnMessage: document.querySelector(".turn-para"),
  chooseMode: document.querySelector(".choose-mode"),
  plOneNamePara: document.querySelector(".pl-one-name"),
  plTwoNamePara: document.querySelector(".pl-two-name"),
  plOneMarkPara: document.querySelector(".pl-one-mark"),
  plTwoMarkPara: document.querySelector(".pl-two-mark"),
  plOneScore: document.querySelector(".pl-one-score"),
  plTwoScore: document.querySelector(".pl-two-score"),
  roundNum: document.querySelector(".round-num"),
  //form variables
  twoPlayersMode: document.querySelector("#two-players"),
  vsComputerMode: document.querySelector("#vs-computer"),
  computerPlaying: false,
  xMarkInput: document.querySelector("#x-mark"),
  circleMarkInput: document.querySelector("#circle-mark"),
  plOneNameInput: document.querySelector("#pl-one-name"),
  plTwoNameInput: document.querySelector("#pl-two-name"),
  //buttons
  resetWhilePlayingBtn: document.querySelector("#reset-while-playing"),
  newGameBtn: document.querySelector("#new-game"),
  resetAfterResultBtn: document.querySelector("#reset-after-result"),
  nextRoundBtn: document.querySelector("#next-round"),
  //winner section variables
  winnerSection: document.querySelector(".winner-section"),
  winnerMsg: document.querySelector(".winner-msg"),
};

const resetGame = () => {
  window.location.reload();
};
sharedVariables.resetWhilePlayingBtn.addEventListener("click", resetGame);
sharedVariables.resetAfterResultBtn.addEventListener("click", resetGame);

const Player = (name, mark, score) => {
  this.name = name;
  this.mark = mark;
  this.score = score;
  return { name, mark, score };
};

const sharedData = {};

(function chooseGameMode() {
  const xChecked = sharedVariables.xMarkInput.checked ? "X" : "O";

  const setName = (() => {
    setPlOneName = (plOneName) => {
      sharedVariables.plOneNameInput.value
        ? ((sharedVariables.plOneNamePara.innerHTML =
            sharedVariables.plOneNameInput.value),
          (plOneName = sharedVariables.plOneNameInput.value))
        : ((sharedVariables.plOneNamePara.innerHTML = "P1"),
          (plOneName = "P1"));
      return plOneName;
    };
    setPlTwoName = (plTwoName) => {
      sharedVariables.plTwoNameInput.value
        ? ((sharedVariables.plTwoNamePara.innerHTML =
            sharedVariables.plTwoNameInput.value),
          (plTwoName = sharedVariables.plTwoNameInput.value))
        : ((sharedVariables.plTwoNamePara.innerHTML = "P2"),
          (plTwoName = "P2"));
      return plTwoName;
    };
    return { setPlOneName, setPlTwoName };
  })();

  const setMark = (() => {
    setPlOneMark = (plOneMark) => {
      if (sharedVariables.xMarkInput.checked) {
        sharedVariables.board.classList.add("x");
        sharedVariables.plOneMarkPara.innerHTML = "X";
        sharedVariables.turnMessage.textContent = `X 's turn to play`;
        plOneMark = "x";
      } else if (sharedVariables.circleMarkInput.checked) {
        sharedVariables.board.classList.add("circle");
        sharedVariables.plOneMarkPara.innerHTML = "O";
        sharedVariables.turnMessage.textContent = `O 's turn to play`;
        plOneMark = "circle";
      }
      return { plOneMark };
    };
    setPlTwoMark = (plTwoMark) => {
      if (sharedVariables.xMarkInput.checked) {
        sharedVariables.board.classList.add("x");
        sharedVariables.plTwoMarkPara.innerHTML = "O";
        plTwoMark = "circle";
      } else if (sharedVariables.circleMarkInput.checked) {
        sharedVariables.board.classList.add("circle");
        sharedVariables.plTwoMarkPara.innerHTML = "X";
        plTwoMark = "x";
      }
      return { plTwoMark };
    };
    return { setPlOneMark, setPlTwoMark };
  })();

  function handleFormSubmit(event) {
    const form = event.target;
    if (!form.checkValidity()) {
      return;
    }
    event.preventDefault();

    sharedVariables.chooseMode.classList.toggle("show");
    sharedVariables.gameMode.classList.toggle("hide");

    sharedData.givenNameP1 = setName.setPlOneName(
      sharedVariables.plOneNameInput.value
    );
    sharedData.givenNameP2 = setName.setPlTwoName(
      sharedVariables.plTwoNameInput.value
    );

    sharedData.givenMarkP1 = setMark.setPlOneMark(xChecked);
    sharedData.givenMarkP2 = setMark.setPlTwoMark(xChecked);

    form.reset();
    gameController.createPlayers();
  }
  const formEl = document.querySelector("form");
  formEl.addEventListener("submit", handleFormSubmit);
  //when vsComputer chosen disable second input and add pl2 name Computer
  handleComputerMode = () => {
    if (sharedVariables.vsComputerMode.checked) {
      sharedVariables.plTwoNameInput.value = "Computer";
      sharedVariables.plTwoNameInput.disabled = true;
      sharedVariables.computerPlaying = true;
    } else if (sharedVariables.twoPlayersMode.checked) {
      sharedVariables.plTwoNameInput.value = "";
      sharedVariables.plTwoNameInput.disabled = false;
      sharedVariables.computerPlaying = false;
    }
  };
  sharedVariables.vsComputerMode.addEventListener("change", handleComputerMode);
  sharedVariables.twoPlayersMode.addEventListener("change", handleComputerMode);
  return { setName, setMark, handleFormSubmit };
})();

const gameBoard = (() => {
  //boardArr saved inside sharedVariables object
  const setCell = (index, mark) => {
    if (index > sharedVariables.boardArr.length) return;
    sharedVariables.boardArr[index] = mark;
    sharedVariables.cells[index].classList.add(mark);
  };

  const getCell = (index) => {
    if (index > sharedVariables.boardArr.length) return;
    return sharedVariables.boardArr[index];
  };

  const reset = () => {
    for (let i = 0; i < sharedVariables.boardArr.length; i++) {
      sharedVariables.boardArr[i] = "";
    }
  };
  return { setCell, getCell, reset };
})();
const displayController = (() => {
  sharedVariables.cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  // if (gameController.computerPlaysFirst()) {
  //   console.log('hey')
  //   gameController.playMove(getComputerMove());
  // }

  function handleCellClick(e) {
    const fieldIndex = e.target.dataset.index;

    // Check if the game is over or if the cell has already been clicked
    if (
      gameController.getIsOver() ||
      e.target.classList.contains("x") ||
      e.target.classList.contains("circle")
    )
      return;

    // Play the player's move
    gameController.playMove(fieldIndex);
    const computerMove = getComputerMove();
    activeMarkHover(gameController.getCurrentMark());

    // If vsComputer mode is enabled and it's the computer's turn
    if (
      sharedVariables.computerPlaying &&
      gameController.getCurrentMark() === sharedData.givenMarkP2.plTwoMark &&
      !gameController.getIsOver()
    ) {
      //  if (gameController.computerPlaysFirst()) {
      //   //  console.log(`movess: ${gameController.getMove()}`);
      //    console.log(`First move: ${computerMove}`);
      //    gameController.playMove(computerMove);
      //   //  console.log(gameController.playMove(computerMove));
      //    activeMarkHover(gameController.getCurrentMark());
      //  }
         // Otherwise, it's not the first move, get and play the computer's move
         // const computerMove = getComputerMove();
         console.log("Computer Turn");
         console.log("Computer Move:", computerMove);
         console.log(`Current mark: ${gameController.getCurrentMark()}`);
        //  console.log(`move value: ${gameController.getMove()}`);
         activeMarkHover(gameController.getCurrentMark());
         return gameController.playMove(computerMove);
    }
  }

  function getComputerMove() {
    if (gameController.getIsOver()) {
      return;
    }
    // Get available empty cells
    const emptyCells = Array.from(sharedVariables.cells).filter(
      (cell) =>
        !cell.classList.contains("x") && !cell.classList.contains("circle")
    );

    if (emptyCells.length === 0) {
      console.error("No empty cells available!");
      return null; // Return null if there are no empty cells
    }

    // Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    // Parse the dataset index as a number before returning
    const index = parseInt(emptyCells[randomIndex].dataset.index);
    return index;
  }

  const newGame = () => {
    gameBoard.reset();
    gameController.reset();
    removeMarks();
    gameController.setTurn();
    sharedVariables.plOneScore.textContent = 0;
    sharedVariables.plTwoScore.textContent = 0;
    sharedVariables.roundNum.textContent = 1;
  };

  sharedVariables.newGameBtn.addEventListener("click", newGame);

  const activeMarkHover = (currentMark) => {
    sharedVariables.board.classList.remove("x", "circle");
    sharedVariables.board.classList.add(currentMark);
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      sharedVariables.winnerSection.classList.toggle("show");
      setMessageElement("It's a DRAW!");
    } else {
      sharedVariables.winnerSection.classList.toggle("show");
      setMessageElement(`${winner} has won!`);
    }
  };

  const setMessageElement = (message) => {
    sharedVariables.winnerMsg.textContent = message;
  };

  const removeMarks = () => {
    for (let i = 0; i < sharedVariables.cells.length; i++) {
      sharedVariables.cells[i].classList.remove("x");
      sharedVariables.cells[i].classList.remove("circle");
    }
  };

  const nextRound = () => {
    gameController.restartRound();
    gameBoard.reset();
    removeMarks();
    gameController.setTurn();
    sharedVariables.winnerSection.classList.toggle("show");
    // gameController.getMove();
    console.log(`move after next round: ${gameController.getMove()}`);
    // console.log(`func cp plays first:${gameController.computerPlaysFirst()}`);
    // console.log(`variable computerplaying: ${sharedVariables.computerPlaying}`);
    // console.log(`current mark: ${gameController.getCurrentMark()}`);
    // console.log(`computer mark: ${sharedData.givenMarkP2.plTwoMark}`);
    // console.log(`is over variable: ${gameController.getIsOver()}`);
  };
  sharedVariables.nextRoundBtn.addEventListener("click", nextRound);

  return {
    handleCellClick,
    setMessageElement,
    setResultMessage,
    activeMarkHover,
    getComputerMove,
  };
})();

const gameController = (() => {
  let player1, player2;
  const createPlayers = () => {
    player1 = Player(
      sharedData.givenNameP1,
      sharedData.givenMarkP1.plOneMark,
      0
    );
    player2 = Player(
      sharedData.givenNameP2,
      sharedData.givenMarkP2.plTwoMark,
      0
    );
  };
  let round = 1;
  let move = 1;
  let isOver = false;

  const playMove = (fieldIndex) => {
    gameBoard.setCell(fieldIndex, getCurrentMark());
    if (checkWinner(fieldIndex)) {
      if (getCurrentMark() === player1.mark) {
        player1.score++;
        sharedVariables.plOneScore.textContent = player1.score;
        displayController.setResultMessage(`${player1.name}(${player1.mark})`);
      } else if (getCurrentMark() === player2.mark) {
        player2.score++;
        sharedVariables.plTwoScore.textContent = player2.score;
        displayController.setResultMessage(`${player2.name}(${player2.mark})`);
      }
      isOver = true;
      round++;
      sharedVariables.roundNum.textContent = round;
      console.log(`move:${move}`);
      console.log(`Round: ${round}`);
      return;
    }
    if (move === 9) {
      // setTimeout(function () {
      displayController.setResultMessage("Draw");
      isOver = true;
      round++;
      sharedVariables.roundNum.textContent = round;
      console.log(`Round: ${round}`);
      return;
      // }, 1000);
    }
    console.log(`move before increment: ${move}`)
    move++;
    setTurn();
    console.log(`move after increment:${move}`);
  };

  const getCurrentMark = () => {
    if (round % 2 === 1) {
      return move % 2 === 1
        ? sharedData.givenMarkP1.plOneMark
        : sharedData.givenMarkP2.plTwoMark;
    } else {
      return move % 2 === 1
        ? sharedData.givenMarkP2.plTwoMark
        : sharedData.givenMarkP1.plOneMark;
    }
  };

  const checkWinner = (fieldIndex) => {
    fieldIndex = parseInt(fieldIndex);
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => {
        return combination.includes(fieldIndex);
      })
      .some((possibleCombination) => {
        const isWinningCombination = possibleCombination.every(
          (index) => gameBoard.getCell(index) === getCurrentMark()
        );
        return isWinningCombination;
      });
  };

  const setTurn = () => {
    const currentMark = getCurrentMark();
    if (currentMark === "circle") {
      sharedVariables.turnMessage.textContent = `O 's turn to play`;
    } else {
      sharedVariables.turnMessage.textContent = `X 's turn to play`;
    }
    displayController.activeMarkHover(currentMark);
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    move = 1;
    round = 1;
    isOver = false;
    player1.score = 0;
    player2.score = 0;
  };

  const computerPlaysFirst = () => {
      return round % 2 === 0 &&
      !getIsOver() &&
      move === 1 &&
      getCurrentMark() === sharedData.givenMarkP2.plTwoMark
  };

  const restartRound = () => {
    move = 1;
    isOver = false;
    setTurn();
  };

  const getMove = () => {
    return move;
  };

  return {
    playMove,
    getIsOver,
    reset,
    getCurrentMark,
    setTurn,
    createPlayers,
    checkWinner,
    restartRound,
    computerPlaysFirst,
    getMove,
  };
})();

(function triggerComputerMove() {
  if (gameController.computerPlaysFirst()) {
    const computerMove = displayController.getComputerMove();
    gameController.playMove(computerMove);
    console.log('hiii');
  }
})();
