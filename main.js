//store important variables inside object and access them everywhere 
const sharedVariables = {
  //game mode variables 
  board : document.querySelector(".board"),
  cells : document.querySelectorAll(".cell"),
  gameMode : document.querySelector(".game-mode"),
  turnMessage: document.querySelector('.turn-para'),
  chooseMode : document.querySelector(".choose-mode"),
  plOneNamePara : document.querySelector(".pl-one-name"),
  plTwoNamePara : document.querySelector(".pl-two-name"),
  plOneMarkPara : document.querySelector(".pl-one-mark"),
  plTwoMarkPara : document.querySelector(".pl-two-mark"),
  //form variables
  twoPlayersMode : document.querySelector("#two-players"),
  vsComputerMode : document.querySelector("#vs-computer"),
  xMarkInput : document.querySelector("#x-mark"),
  circleMarkInput : document.querySelector("#circle-mark"),
  plOneNameInput : document.querySelector("#pl-one-name"),
  plTwoNameInput : document.querySelector("#pl-two-name"),
  //buttons
  resetWhilePlayingBtn : document.querySelector("#reset-while-playing"),
  newGameBtn : document.querySelector("#new-game"),
  resetAfterResultBtn : document.querySelector("#reset-after-result"),
  nextRoundBtn : document.querySelector("#next-round"),
  //winner section variables
  winnerSection : document.querySelector(".winner-section"),
  winnerMsg : document.querySelector(".winner-msg"),
};

const Player = (name, mark, score) => {
  this.name = name;
  this.mark = mark;
  this.score = score;
  getName = () => {
    return name;
  };
  getMark = () => {
    return mark;
  };
  getScore = () => {
    return score;
  };
  return { getName, getMark, getScore };
};

const sharedData = {};

(function chooseGameMode() {
  const xChecked = sharedVariables.xMarkInput.checked ? "X" : "O";

  const setName = (() => {
    setPlOneName = (plOneName) => {
      sharedVariables.plOneNameInput.value
        ? ((sharedVariables.plOneNamePara.innerHTML = sharedVariables.plOneNameInput.value),
          (plOneName = sharedVariables.plOneNameInput.value))
        : ((sharedVariables.plOneNamePara.innerHTML = "P1"), (plOneName = "P1"));
      return plOneName;
    };
    setPlTwoName = (plTwoName) => {
      sharedVariables.plTwoNameInput.value
        ? ((sharedVariables.plTwoNamePara.innerHTML = sharedVariables.plTwoNameInput.value),
          (plTwoName = sharedVariables.plTwoNameInput.value))
        : ((sharedVariables.plTwoNamePara.innerHTML = "P2"), (plTwoName = "P2"));
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

    sharedData.givenNameP1 = setName.setPlOneName(sharedVariables.plOneNameInput.value);
    sharedData.givenNameP2 = setName.setPlTwoName(sharedVariables.plTwoNameInput.value);

    sharedData.givenMarkP1 = setMark.setPlOneMark(xChecked);
    sharedData.givenMarkP2 = setMark.setPlTwoMark(xChecked);
    console.log(sharedData.givenMarkP1);
    console.log(sharedData.givenMarkP2);
    

    if (sharedVariables.vsComputerMode.checked) {
      sharedVariables.plTwoNamePara.innerHTML = "Computer";
    }

    form.reset();
    gameController();
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
  const boardArr = ["", "", "", "", "", "", "", "", ""];

  const setCell = (index, mark) => {
    if (index > boardArr.length) return;
    boardArr[index] = mark;
  };

  const getCell = (index) => {
    if (index > boardArr.length) return;
    return boardArr[index];
  };

  const reset = () => {
    for (let i = 0; i < boardArr.length; i++) {
      boardArr[i] = "";
    }
  };

  return { setCell, getCell, reset };
})();

const displayController = (() => {
  let move = 1;
  const getCurrentMark = () => {
    return move % 2 === 1
      ? sharedData.givenMarkP1.plOneMark
      : sharedData.givenMarkP2.plTwoMark;
  };

  sharedVariables.cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick, { once: true });
  });

  function handleCellClick(e) {
    //call updateGameBoard, PlayRound, setTurn....
    if (
      e.target.classList.contains("x") ||
      e.target.classList.contains(".circle")
    )
      return;
    e.target.classList.add(getCurrentMark());
    move++;
    console.log(move)
    setTurn();
    activeMarkHover();
    checkDraw();
  }

  const checkDraw = () => {
    setTimeout(function () {
      if (move === 10) {
        sharedVariables.winnerSection.classList.add("show");
        sharedVariables.winnerMsg.textContent = `It's a DRAW!`;
      }
    }, 3000);
  };

  const setTurn = () => {
    if (getCurrentMark() === "circle") {
      sharedVariables.turnMessage.textContent = `O 's turn to play`;
    } else {
      sharedVariables.turnMessage.textContent = `X 's turn to play`;
    }
  };

  const activeMarkHover = () => {
    sharedVariables.board.classList.toggle("x");
    sharedVariables.board.classList.toggle("circle");
  }

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      sharedVariables.winnerSection.classList.add("show");
      setMessageElement("It's a DRAW!");
    } else {
      sharedVariables.winnerSection.classList.add("show");
      setMessageElement(`Player: ${winner} has won!`);
    }
  };

  const setMessageElement = (message) => {
    sharedVariables.winnerMsg.textContent = message;
  };

  const updateGameboard = () => {
    for (let i = 0; i < sharedVariables.cells.length; i++) {
      sharedVariables.cells[i].textContent = gameBoard.getCell(i);
    }
  };
})();

const gameController = () => {
  const player1 = Player(
    sharedData.givenNameP1,
    sharedData.givenMarkP1.plOneMark,
    0
  );
  const player2 = Player(
    sharedData.givenNameP2,
    sharedData.givenMarkP2.plTwoMark,
    0
  );
  let move = 1;
  let isOver = false;
  
   const playRound = (fieldIndex) => {
     gameBoard.setCell(fieldIndex, getCurrentMark());
     if (checkWinner(fieldIndex)) {
       displayController.setResultMessage(getCurrentMark());
       isOver = true;
       return;
     }
     if (move === 10) {
       displayController.setResultMessage("Draw");
       isOver = true;
       return;
     }
     move++;
     displayController.setMessageElement(
       `Player ${getCurrentMark()}'s turn`
     );
   };


   const getIsOver = () => {
     return isOver;
   };

   const reset = () => {
     move = 1;
     isOver = false;
   };

   return { playRound, getIsOver, reset };
}
