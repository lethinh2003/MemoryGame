// Các biến để cleanup các time api: settimeout, setinterval
let timerCountDown = null;
let timerFlipCard = null;
let timerDisplayCardStartGame = null;

// Lưu các selector cần thiết
const SELECTORS = {
  container: document.querySelector(".container"),
  body: document.body,
};
// Lưu các thuộc tính game
const GAME = {
  isStart: false,
  initialHeart: 3,
  currentHeart: 3,
  isClickCard: false,
  currentNameCard: null,
  selectedCard: 0,
  itemLength: 0,
  timeCountDown: 10,
};
// Lưu giá trị setting cho game
const GAMESETTINGS = {
  initialHeart: 3,
  itemLength: 10,
  isTimeCountDown: false,
  timeCountDown: 10,
  isOpenSound: false,
};
// Các hình ảnh của thẻ
const ITEMS = [
  {
    name: "apple",
    img: "./assets/imgs/apple.png",
  },
  {
    name: "banana",
    img: "./assets/imgs/banana.png",
  },
  {
    name: "bread",
    img: "./assets/imgs/bread.png",
  },
  {
    name: "coconut",
    img: "./assets/imgs/coconut.png",
  },
  {
    name: "dog",
    img: "./assets/imgs/dog.png",
  },
  {
    name: "duck",
    img: "./assets/imgs/duck.png",
  },
  {
    name: "gift",
    img: "./assets/imgs/gift.png",
  },
  {
    name: "umbrella",
    img: "./assets/imgs/umbrella.png",
  },
  {
    name: "cat",
    img: "./assets/imgs/cat.png",
  },
  {
    name: "bird",
    img: "./assets/imgs/bird.png",
  },
];

// Sự kiện click vào button close modal
const eventCloseModal = () => {
  const closeElement = document.getElementById("modal-close");
  closeElement.addEventListener("click", () => {
    if (GAMESETTINGS.isOpenSound) {
      var audio = new Audio("./assets/sounds/button_click.mp3");
      audio.play();
    }
    closeModal();
  });
};

// Tạo setting modal
const createSettingPopup = () => {
  const popup = document.createElement("div");
  popup.classList.add("modal-container");
  popup.innerHTML = `    <div class="modal-container">
  <div class="modal-body">
    <div class="modal-header">
      <div class="modal-title">Settings game</div>
      <div class="modal-close" id="modal-close">X</div>
    </div>
    <div class="modal-content">
      <div class="desc">
        <div>
          <label class="label-modal" for="select-chedo"
            >Number picture</label
          >
          <div class="select">
            <select id="select-chedo">            
            </select>
          </div>
        </div>
        <div>
          <label class="label-modal"
            >Time Countdown</label
          >
          <input
            type="checkbox"
            id="time-countdown"  
          />
        </div>
        <div>
        <label class="label-modal"
          >Sound (web browser only)</label
        >
        <input
          type="checkbox"
          id="sound-game"  
        />
      </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="button" style="width: 100px">Start Game</div>
    </div>
  </div>
</div>`;
  SELECTORS.body.appendChild(popup);
  eventCloseModal();
  AddSelectPictureNumber();
  InitialValueSettingForm();
  ClickStartGame();

  // Thêm các lựa chọn hình ảnh
  function AddSelectPictureNumber() {
    const selectElement = document.getElementById("select-chedo");
    for (let i = 1; i <= ITEMS.length; i++) {
      const optionElement = document.createElement("option");
      optionElement.value = i;
      optionElement.textContent = i;
      selectElement.appendChild(optionElement);
    }
  }
  // Khởi tạo giá trị mặc định cho form setting
  function InitialValueSettingForm() {
    const getCheckedTimeCountDown = document.getElementById("time-countdown");
    getCheckedTimeCountDown.checked = GAMESETTINGS.isTimeCountDown;
    const getCheckedSoundGame = document.getElementById("sound-game");
    getCheckedSoundGame.checked = GAMESETTINGS.isOpenSound;
    const getSelectPictureNumber = document.getElementById("select-chedo");
    getSelectPictureNumber.value = GAMESETTINGS.itemLength;
  }
  // Sự kiện click vào button Start Game của modal
  function ClickStartGame() {
    const buttonElement = document.querySelector(".modal-body .button");
    buttonElement.addEventListener("click", () => {
      if (GAMESETTINGS.isOpenSound) {
        var audio = new Audio("./assets/sounds/button_click.mp3");
        audio.play();
      }
      const getCheckedTimeCountDown =
        document.getElementById("time-countdown").checked;
      const getCheckedSoundGame = document.getElementById("sound-game").checked;
      const getSelectPictureNumber = parseInt(
        document.getElementById("select-chedo").value
      );
      GAMESETTINGS.itemLength = getSelectPictureNumber;
      GAMESETTINGS.isTimeCountDown = getCheckedTimeCountDown;
      GAMESETTINGS.timeCountDown = GAMESETTINGS.itemLength * 5;
      GAMESETTINGS.isOpenSound = getCheckedSoundGame;
      StartGame();
      closeModal();
    });
  }
};
createSettingPopup();

// Tạo event click cho button mở setting game
const eventButtonOpenSettingGame = () => {
  const settingBtn = document.getElementById("setting-game");
  settingBtn.addEventListener("click", () => {
    if (GAMESETTINGS.isOpenSound) {
      var audio = new Audio("./assets/sounds/button_click.mp3");
      audio.play();
    }
    createSettingPopup();
  });
};

// Tạo event click cho button start game
const eventButtonStartGame = () => {
  const startGameBtn = document.getElementById("start-game");
  startGameBtn.addEventListener("click", () => {
    if (GAMESETTINGS.isOpenSound) {
      var audio = new Audio("./assets/sounds/button_click.mp3");
      audio.play();
    }
    StartGame();
  });
};
eventButtonOpenSettingGame();
eventButtonStartGame();

// Tạo các thẻ
const createCard = () => {
  SELECTORS.container.innerHTML = "";
  // Sắp xếp random item
  let randomItems = ITEMS.sort(() => 0.5 - Math.random());
  let sliceRandomItems = randomItems.slice(0, GAMESETTINGS.itemLength);
  // Gộp 2 mảng item lại
  let currentItems = sliceRandomItems.concat(sliceRandomItems);
  // Sắp xếp random lần nữa
  currentItems.sort(() => 0.5 - Math.random());
  // Thêm các card vào container
  currentItems.map((item) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", item.name);
    let cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    let cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    let cardImg = document.createElement("img");
    cardImg.setAttribute("src", item.img);
    cardImg.classList.add("card-img");
    cardBack.appendChild(cardImg);
    card.appendChild(cardFront);
    card.appendChild(cardBack);
    SELECTORS.container.appendChild(card);
  });
};

// Tạo thông tin số mạng hiện tại
const creatHeart = () => {
  const displayHeart = document.getElementById("current_heart_text");
  displayHeart.innerText = GAME.currentHeart;
};

// Thêm sự kiện click vào các card
const addEventClickCard = () => {
  const cards = document.querySelectorAll(".card");
  const eventClickCard = (event) => {
    const eventTarget = event.target;
    const eventParent = eventTarget.parentElement;
    // Nếu hết mạng thì chặn sự kiện
    if (GAME.currentHeart <= 0) {
      return;
    }
    // Nếu đã lật 2 thẻ rồi thì chặn sự kiện lại
    if (GAME.selectedCard == 2) {
      return;
    }
    // Nếu click vào thẻ đã match thì cũng chặn sự kiện
    if (eventTarget.className !== "card-front") {
      return;
    }
    if (GAMESETTINGS.isOpenSound) {
      var audio = new Audio("./assets/sounds/card_flip.mp3");
      audio.play();
    }
    const nameCard = eventParent.getAttribute("data-name");
    // Nếu đã lật một thẻ
    if (GAME.isClickCard) {
      // Lật thẻ thứ 2
      GAME.selectedCard++;
      flipCard(eventParent);
      if (nameCard != GAME.currentNameCard) {
        // Nếu không match card với nhau
        GAME.currentHeart--;
        timerFlipCard = setTimeout(() => {
          flipNoMatchCard();
          creatHeart();
          if (GAME.currentHeart == 0) {
            loseGame();
          }
        }, 500);
      } else {
        // Nếu match card
        GAME.itemLength++;
        setMatchCard(nameCard);
        if (GAMESETTINGS.itemLength == GAME.itemLength) {
          winGame();
        }
      }
      GAME.currentNameCard = null;
      GAME.isClickCard = false;
    } else {
      // Lật thẻ thứ nhất;
      GAME.selectedCard++;
      GAME.isClickCard = true;
      flipCard(eventParent);
      GAME.currentNameCard = eventParent.getAttribute("data-name");
    }
  };
  cards.forEach((card) => {
    card.addEventListener("click", eventClickCard);
  });
  // Lật lại thẻ khi không match
  const flipNoMatchCard = () => {
    GAME.selectedCard = 0;
    cards.forEach((item) => {
      if (item.classList.contains("flipped")) {
        if (!item.classList.contains("matches")) {
          item.classList.remove("flipped");
        }
      }
    });
  };
  // Khi match thì thêm class matches vào
  const setMatchCard = (name) => {
    GAME.selectedCard = 0;
    cards.forEach((item) => {
      if (
        item.classList.contains("flipped") &&
        item.getAttribute("data-name") === name
      ) {
        item.classList.add("matches");
      }
    });
  };
};

// Lật / ngửa thẻ
const flipCard = (e) => {
  if (e.classList.contains("flipped")) {
    e.classList.remove("flipped");
  } else {
    e.classList.add("flipped");
  }
};

// Thắng game
const winGame = () => {
  resetGame();
  alert("Chúc mừng bạn đã thắng");
};

// Thua game
const loseGame = () => {
  resetGame();
  alert("Bạn đã thua cuộc");
};

// Khi bắt đầu game thì hiển thị 3s rồi sau đó úp thẻ
const displayCard = () => {
  const cardsSelector = document.querySelectorAll(".card");
  cardsSelector.forEach((item) => {
    item.classList.add("flipped");
  });
  timerDisplayCardStartGame = setTimeout(() => {
    cardsSelector.forEach((item) => {
      item.classList.remove("flipped");
    });
    addEventClickCard();
    setCounDownTimer();
  }, 3000);
};

// Khởi tạo thuộc tính cho game
const InitialGame = () => {
  GAME.currentNameCard = null;
  GAME.initialHeart = GAMESETTINGS.initialHeart;
  GAME.currentHeart = GAME.initialHeart;
  GAME.isClickCard = false;
  GAME.isStart = false;
  GAME.itemLength = 0;
  GAME.timeCountDown = GAMESETTINGS.timeCountDown;
  const displayCountDownTime = document.getElementById("time_coundown_text");
  displayCountDownTime.innerHTML = GAME.timeCountDown + "s";
};

// Bắt đầu game
const StartGame = () => {
  GAMESETTINGS.timeCountDown = GAMESETTINGS.itemLength * 5;
  GAME.isStart = true;
  clearInterval(timerCountDown);
  clearTimeout(timerDisplayCardStartGame);
  clearTimeout(timerFlipCard);
  InitialGame();
  creatHeart();
  createCard();
  displayCard();
};

// Đóng modal
const closeModal = () => {
  const modalContainer = document.querySelector(".modal-container");
  modalContainer.remove();
};

// Hàm đếm ngược thời gian
const setCounDownTimer = () => {
  const displayCountDownTime = document.getElementById("time_coundown_text");
  if (timerCountDown != null) {
    clearInterval(timerCountDown);
  }
  if (GAMESETTINGS.isTimeCountDown) {
    timerCountDown = setInterval(() => {
      GAME.timeCountDown--;
      displayCountDownTime.innerHTML = GAME.timeCountDown + "s";
      if (GAME.timeCountDown <= 0) {
        loseGame();
      }
    }, 1000);
  }
};

// Hàm reset lại game
const resetGame = () => {
  clearInterval(timerCountDown);
  clearTimeout(timerDisplayCardStartGame);
  clearTimeout(timerFlipCard);
  InitialGame();
  creatHeart();
  const displayCountDownTime = document.getElementById("time_coundown_text");
  displayCountDownTime.innerHTML = "0s";
  SELECTORS.container.innerHTML = "";
};
