// Константы
const canvasWidth = 700;
const canvasHeight = 500;
const ballRadius = 20;
const groundHeight = 50;
const gravity = 1;
const airResistanceCoefficient = 0.005;

// Создание холста
const canvas = document.createElement("canvas");
canvas.classList.add("canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
document.body.appendChild(canvas);
const context = canvas.getContext("2d");

// Загрузка изображения
const ballImage = new Image();
ballImage.src = "tennisball.png";

// Обработчик события загрузки изображения
ballImage.addEventListener("load", function () {
  draw();
});

// Позиция и скорость шарика
let ballX = canvasWidth / 2;
let ballY = ballRadius;
let velocityY = 0;

// Функция отрисовки шарика и поверхностей
function draw() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // Отрисовка верхней линии
  context.beginPath();
  context.moveTo(0, ballRadius);
  context.lineTo(canvasWidth, ballRadius);
  context.strokeStyle = "white";
  context.stroke();
  context.closePath();

  // Отрисовка нижней линии
  context.beginPath();
  context.moveTo(0, canvasHeight - groundHeight + ballRadius);
  context.lineTo(canvasWidth, canvasHeight - groundHeight + ballRadius);
  context.strokeStyle = "white";
  context.stroke();
  context.closePath();

  // Отрисовка шарика
  context.drawImage(
    ballImage,
    ballX - ballRadius,
    ballY,
    ballRadius * 2,
    ballRadius * 2
  );
}

// Функция обновления положения шарика
function update() {
  if (ballY + ballRadius >= canvasHeight - groundHeight) {
    ballY = canvasHeight - groundHeight - ballRadius;
    velocityY *= -1; // Отскок
    // Учет сопротивления воздуха
    const airResistance = airResistanceCoefficient * velocityY * velocityY;
    if (velocityY > 0) {
      velocityY -= airResistance;
    } else {
      velocityY += airResistance;
    }
  }

  // Изменение скорости шарика под воздействием гравитации
  velocityY += gravity;

  // Обновление позиции шарика
  ballY += velocityY;

  // Проверка и исправление позиции шарика, чтобы не пересекал нижнюю линию
  if (ballY + ballRadius > canvasHeight - groundHeight) {
    ballY = canvasHeight - groundHeight - ballRadius;
  }
}

// Запуск игры
let isGameRunning = false;

function gameLoop() {
  update();
  draw();

  if (isGameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

function startGame() {
  if (!isGameRunning) {
    isGameRunning = true;
    gameLoop();
  }
}

// Создание кнопки "Старт/Рестарт"
const startRestartButton = document.createElement("button");
startRestartButton.textContent = "Старт";
startRestartButton.classList.add("custom-button");
document.body.appendChild(startRestartButton);

// Обработчик кнопки "Старт/Рестарт"
startRestartButton.addEventListener("click", function () {
  if (!isGameRunning) {
    startGame();
    startRestartButton.textContent = "Рестарт";
  } else {
    location.reload(); // Перезагрузка страницы для рестарта игры
  }
});

// Проверка параметров URL и запуск игры при необходимости
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("gameRunning") === "true") {
  startGame();
  startRestartButton.textContent = "Рестарт";
}

// Изначальная отрисовка
draw();
