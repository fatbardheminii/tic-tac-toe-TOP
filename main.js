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

(function chooseGameMode() {
  //variables
  const gameMode = document.querySelector(".game-mode");
  const board = document.querySelector(".board");
  const chooseMode = document.querySelector(".choose-mode");
  const plOneNamePara = document.querySelector(".pl-one-name");
  const plTwoNamePara = document.querySelector(".pl-two-name");
  const plOneMarkPara = document.querySelector(".pl-one-mark");
  const plTwoMarkPara = document.querySelector(".pl-two-mark");

  //form variables
  const twoPlayersMode = document.querySelector("#two-players");
  const vsComputerMode = document.querySelector("#vs-computer");
  const xMarkInput = document.querySelector("#x-mark");
  const circleMarkInput = document.querySelector("#circle-mark");
  const plOneNameInput = document.querySelector("#pl-one-name");
  const plTwoNameInput = document.querySelector("#pl-two-name");

  const setName = (() => {
    setPlOneName = (plOneName) => {
      plOneNameInput.value
        ? ((plOneNamePara.innerHTML = plOneNameInput.value),
          (plOneName = plOneNameInput.value))
        : ((plOneNamePara.innerHTML = "P1"), (plOneName = "P1"));
      return plOneName;
    };
    setPlTwoName = (plTwoName) => {
      plTwoNameInput.value
        ? ((plTwoNamePara.innerHTML = plTwoNameInput.value),
          (plTwoName = plTwoNameInput.value))
        : ((plTwoNamePara.innerHTML = "P2"), (plTwoName = "P2"));
      return plTwoName;
    };
    return { setPlOneName, setPlTwoName };
  })();

  const setMark = (() => {
    setPlOneMark = (plOneMark) => {
      if (xMarkInput.checked) {
        board.classList.add("x");
        plOneMarkPara.innerHTML = "X";
        plOneMark = "X";
      } else if (circleMarkInput.checked) {
        board.classList.add("circle");
        plOneMarkPara.innerHTML = "O";
        plOneMark = "O";
      }
      return {plOneMark};
    };
    setPlTwoMark = (plTwoMark) => {
      if (xMarkInput.checked) {
        board.classList.add("x");
        plTwoMarkPara.innerHTML = "O";
        plTwoMark = "O";
      } else if (circleMarkInput.checked) {
        board.classList.add("circle");
        plTwoMarkPara.innerHTML = "X";
        plTwoMark = "X";
      }
      return {plTwoMark};
    };
    return { setPlOneMark, setPlTwoMark };
  })();

  function handleFormSubmit(event) {
    const form = event.target;
    if (!form.checkValidity()) {
      return;
    }
    event.preventDefault();

    chooseMode.classList.toggle("show");
    gameMode.classList.toggle("hide");

    setName.setPlOneName(plOneNameInput.value);
    setName.setPlTwoName(plTwoNameInput.value);

    const xChecked = xMarkInput.checked ? "X" : "O";
    setMark.setPlOneMark(xChecked);
    setMark.setPlTwoMark(xChecked);

    if (vsComputerMode.checked) {
      plTwoNamePara.innerHTML = "Computer";
    }

    form.reset();
  }
  const formEl = document.querySelector("form");
  formEl.addEventListener("submit", handleFormSubmit);
  //when vsComputer chosen disable second input and add pl2 name Computer
  handleGameMode = () => {
    if (vsComputerMode.checked) {
      plTwoNameInput.value = "Computer";
      plTwoNameInput.disabled = true;
    } else if (twoPlayersMode.checked) {
      plTwoNameInput.value = "";
      plTwoNameInput.disabled = false;
    }
  };
  vsComputerMode.addEventListener("change", handleGameMode);
  twoPlayersMode.addEventListener("change", handleGameMode);
  return {setName, setMark}
})();

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setCell = (index, mark) => {
    if (index > board.length) return;
    board[index] = mark;
  };

  const getCell = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setCell, getCell, reset };
})();
