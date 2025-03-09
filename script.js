// Игровые данные
const players = [
  { name: "Игрок 1", position: 0, money: 1500, properties: [], inJail: false },
  { name: "Игрок 2", position: 0, money: 1500, properties: [], inJail: false }
];
let currentPlayer = 0;

// Стадионы (футбольные клубы)
const properties = [
  { name: "Старт", type: "start", image: "images/start.jpg" },
  { name: "Реал Мадрид", price: 200, rent: 50, owner: null, image: "images/real_madrid.jpg" },
  { name: "Барселона", price: 200, rent: 50, owner: null, image: "images/barcelona.jpg" },
  { name: "Манчестер Юнайтед", price: 300, rent: 75, owner: null, image: "images/man_utd.jpg" },
  { name: "Ливерпуль", price: 300, rent: 75, owner: null, image: "images/liverpool.jpg" },
  { name: "Бавария", price: 400, rent: 100, owner: null, image: "images/bayern.jpg" },
  { name: "Тюрьма", type: "jail", image: "images/jail.jpg" },
  { name: "ПСЖ", price: 350, rent: 80, owner: null, image: "images/psg.jpg" },
  { name: "Ювентус", price: 250, rent: 60, owner: null, image: "images/juventus.jpg" },
  { name: "Челси", price: 300, rent: 75, owner: null, image: "images/chelsea.jpg" },
  { name: "Налог", type: "tax", amount: 100, image: "images/tax.jpg" },
  { name: "Бесплатная парковка", type: "freeParking", image: "images/free_parking.jpg" },
  { name: "Шанс", type: "chance", image: "images/chance.jpg" },
  { name: "Общественная казна", type: "communityChest", image: "images/community_chest.jpg" },
];

// Карточки "Шанс" и "Общественная казна"
const chanceCards = [
  { text: "Вы выиграли в лотерею! Получите 100.", effect: (player) => player.money += 100 },
  { text: "Штраф за нарушение правил. Заплатите 50.", effect: (player) => player.money -= 50 }
];

const communityChestCards = [
  { text: "Ваш клуб выиграл турнир! Получите 200.", effect: (player) => player.money += 200 },
  { text: "Ремонт стадиона. Заплатите 100.", effect: (player) => player.money -= 100 }
];

// Звуки
const diceSound = document.getElementById("diceSound");
const buySound = document.getElementById("buySound");
const rentSound = document.getElementById("rentSound");

// Генерация игрового поля
const board = document.getElementById("board");
properties.forEach((property, index) => {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.textContent = property.name;
  if (property.image) {
    const img = document.createElement("img");
    img.src = property.image;
    cell.appendChild(img);
  }
  board.appendChild(cell);
});

// Бросок кубика с анимацией и звуком
document.getElementById("rollDice").addEventListener("click", () => {
  const diceResult = document.getElementById("diceResult");
  diceResult.classList.add("dice-animation");
  diceSound.play();

  setTimeout(() => {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    diceResult.textContent = `Вы выбросили ${dice1} и ${dice2}`;
    diceResult.classList.remove("dice-animation");

    movePlayer(total);
    document.getElementById("rollDice").disabled = true;
    document.getElementById("endTurn").disabled = false;
  }, 500); // Длительность анимации
});

// Завершение хода
document.getElementById("endTurn").addEventListener("click", () => {
  currentPlayer = (currentPlayer + 1) % players.length;
  updatePlayerStats();
  document.getElementById("rollDice").disabled = false;
  document.getElementById("endTurn").disabled = true;
});

// Перемещение игрока
function movePlayer(steps) {
  const player = players[currentPlayer];
  player.position = (player.position + steps) % properties.length;
  const currentProperty = properties[player.position];

  document.getElementById("playerInfo").textContent = 
    `${player.name} на клетке ${currentProperty.name}`;

  handleProperty(currentProperty, player);
  updatePlayerStats();
}

// Обработка клетки
function handleProperty(property, player) {
  if (property.type === "start") {
    player.money += 200;
  } else if (property.type === "jail") {
    player.inJail = true;
    alert(`${player.name} попал в тюрьму!`);
  } else if (property.type === "tax") {
    player.money -= property.amount;
    alert(`${player.name} заплатил налог: $${property.amount}`);
  } else if (property.type === "freeParking") {
    alert(`${player.name} на бесплатной парковке!`);
  } else if (property.type === "chance") {
    const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
    card.effect(player);
    alert(`Шанс: ${card.text}`);
  } else if (property.type === "communityChest") {
    const card = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
    card.effect(player);
    alert(`Общественная казна: ${card.text}`);
  } else if (property.owner === null) {
    if (confirm(`Купить ${property.name} за ${property.price}?`)) {
      if (player.money >= property.price) {
        player.money -= property.price;
        player.properties.push(property);
        property.owner = player;
        playBuySound();
      } else {
        alert("Недостаточно денег!");
      }
    }
  } else if (property.owner !== player) {
    player.money -= property.rent;
    property.owner.money += property.rent;
    alert(`Вы заплатили аренду ${property.rent} игроку ${property.owner.name}`);
    playRentSound();
  }
}

// Обновление статистики игроков
function updatePlayerStats() {
  const statsDiv = document.getElementById("playerStats");
  statsDiv.innerHTML = players.map(player => `
    <p><strong>${player.name}</strong>: $${player.money}</p>
    <p>Собственность: ${player.properties.map(p => p.name).join(", ")}</p>
  `).join("");
}

// Звук при покупке
function playBuySound() {
  buySound.play();
}

// Звук при выплате аренды
function playRentSound() {
  rentSound.play();
}