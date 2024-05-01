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
  //form variables
  twoPlayersMode: document.querySelector("#two-players"),
  vsComputerMode: document.querySelector("#vs-computer"),
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
}
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

    if (sharedVariables.vsComputerMode.checked) {
      sharedVariables.plTwoNamePara.innerHTML = "Computer";
    }

    form.reset();
    // gameController();
    gameController.createPlayers();
  }
  const formEl = document.querySelector("form");
  formEl.addEventListener("submit", handleFormSubmit);
  //when vsComputer chosen disable second input and add pl2 name Computer
  handleGameMode = () => {
    if (sharedVariables.vsComputerMode.checked) {
      sharedVariables.plTwoNameInput.value = "Computer";
      sharedVariables.plTwoNameInput.disabled = true;
    } else if (sharedVariables.twoPlayersMode.checked) {
      sharedVariables.plTwoNameInput.value = "";
      sharedVariables.plTwoNameInput.disabled = false;
    }
  };
  sharedVariables.vsComputerMode.addEventListener("change", handleGameMode);
  sharedVariables.twoPlayersMode.addEventListener("change", handleGameMode);
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

  function handleCellClick(e) {
    const fieldIndex = e.target.dataset.index;
    if (
      gameController.getIsOver() ||
      e.target.classList.contains("x") ||
      e.target.classList.contains(".circle")
    )
      return;
    gameController.playMove(fieldIndex);
    activeMarkHover();
  }

  const newGame = () => {
    gameBoard.reset();
    gameController.reset();
    removeMarks();
    gameController.setTurn();
    // gameController.player1.score = 0;
    // console.log(gameController.player1.score);
    sharedVariables.plOneScore.textContent = 0;
    // gameController.player2.score = 0;
    // console.log(gameController.player2.score);
    sharedVariables.plTwoScore.textContent = 0;
  };

  sharedVariables.newGameBtn.addEventListener('click', newGame);

  const activeMarkHover = () => {
    sharedVariables.board.classList.toggle("x");
    sharedVariables.board.classList.toggle("circle");
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
      sharedVariables.cells[i].classList.remove('x');
      sharedVariables.cells[i].classList.remove('circle');
    }
  };

  const nextRound = () => {
    gameBoard.reset();
    gameController.restartRound();
    removeMarks();
    gameController.setTurn();
    sharedVariables.winnerSection.classList.toggle("show");
  }
  sharedVariables.nextRoundBtn.addEventListener('click', nextRound);

  return { setMessageElement, setResultMessage };
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
      return;
    }
    if (move === 9) {
      setTimeout(function () {
        displayController.setResultMessage("Draw");
        isOver = true;
        return;
      }, 1000);
    }
    move++;
    setTurn();
  };

  const getCurrentMark = () => {
    return move % 2 === 1
      ? sharedData.givenMarkP1.plOneMark
      : sharedData.givenMarkP2.plTwoMark;
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
    if (getCurrentMark() === "circle") {
      sharedVariables.turnMessage.textContent = `O 's turn to play`;
    } else {
      sharedVariables.turnMessage.textContent = `X 's turn to play`;
    }
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    move = 1;
    isOver = false;
    player1.score = 0;
    player2.score = 0;
  };

  const restartRound = () => {
    move = 1;
    isOver = false;
  }

  return {
    playMove,
    getIsOver,
    reset,
    getCurrentMark,
    setTurn,
    createPlayers,
    checkWinner,
    restartRound
  };
})();

