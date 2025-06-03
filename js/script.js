const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameBoard = document.querySelector('.game-board');

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const coinCountElement = document.getElementById('coin-count');
const livesElement = document.getElementById('lives');
const bgMusic = document.getElementById('bg-music');

const jumpSound = new Audio('audio/jump-mario.mp3');
jumpSound.volume = 0.1;

const gameOverSound = new Audio('audio/game-over.mp3');
const coinSound = new Audio('audio/coin.mp3');

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let coinCount = 0;
let lives = 3;
let isGameOver = false;
let coinInterval;

highScoreElement.textContent = highScore;
coinCountElement.textContent = coinCount;

function renderLives() {
  livesElement.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('span');
    heart.classList.add('heart');
    if (i >= lives) heart.classList.add('lost');
    livesElement.appendChild(heart);
  }
}
renderLives();

const jump = () => {
  if (isGameOver) return;

  mario.classList.add('jump');
  jumpSound.currentTime = 0;
  jumpSound.play();

  setTimeout(() => {
    mario.classList.remove('jump');
  }, 500);
};

const resetPipePosition = () => {
  pipe.style.animation = 'none';
  pipe.style.right = '-80px';
  void pipe.offsetWidth;
  pipe.style.animation = 'pipe-animation 2s infinite linear';
};

const handleCollision = () => {
  if (isGameOver) return;

  lives--;
  renderLives();

  if (lives <= 0) {
    isGameOver = true;

    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`;

    mario.style.animation = 'none';
    mario.style.bottom = window.getComputedStyle(mario).bottom;

    mario.src = "img/game-over.png";
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    gameOverSound.play();
    bgMusic.pause();

    clearInterval(loop);
    clearInterval(scoreInterval);
    clearInterval(coinInterval);
  } else {
    resetPipePosition();
    mario.style.filter = 'brightness(0.7)';
    setTimeout(() => {
      mario.style.filter = 'none';
    }, 500);
  }
};

function createCoin() {
  if (isGameOver) return;

  const coin = document.createElement('img');
  coin.src = 'img/coin.png';
  coin.classList.add('coin');
  coin.style.right = '-40px';
  gameBoard.appendChild(coin);

  coin.collected = false;

  coin.addEventListener('animationend', () => {
    if (!coin.collected) coin.remove();
  });
}

coinInterval = setInterval(() => {
  if (!isGameOver) {
    createCoin();
  }
}, 2000);

function isPipeNear() {
  const pipePosition = pipe.offsetLeft;
  return pipePosition > 0 && pipePosition < 200;
}

function createEnemy() {
  if (isGameOver) return;

  if (isPipeNear()) return;

  const enemy = document.createElement('img');
  enemy.src = 'img/goomba.gif';
  enemy.classList.add('enemy');
  enemy.style.right = '-80px';
  gameBoard.appendChild(enemy);

  enemy.addEventListener('animationend', () => {
    enemy.remove();
  });
}

function spawnEnemyRandomly() {
  if (isGameOver) return;

  const randomTime = Math.random() * 2000 + 3000;
  setTimeout(() => {
    createEnemy();
    spawnEnemyRandomly();
  }, randomTime);
}
spawnEnemyRandomly();

const loop = setInterval(() => {
  if (isGameOver) return;

  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    handleCollision();
  }

  document.querySelectorAll('.coin').forEach((coin) => {
    const coinPosition = coin.offsetLeft;

    if (
      coinPosition <= 120 &&
      coinPosition > 0 &&
      marioPosition > 80 &&
      !coin.collected
    ) {
      coin.collected = true;
      coin.remove();
      coinSound.currentTime = 0;
      coinSound.play();
      coinCount++;
      coinCountElement.textContent = coinCount;
    }
  });

  document.querySelectorAll('.enemy').forEach((enemy) => {
    const enemyPosition = enemy.offsetLeft;

    if (
      enemyPosition <= 120 &&
      enemyPosition > 0 &&
      marioPosition < 80
    ) {
      handleCollision();
      enemy.remove();
    }
  });
}, 10);

const scoreInterval = setInterval(() => {
  if (!isGameOver) {
    score++;
    scoreElement.textContent = score;
  }
}, 500);

document.addEventListener('keydown', jump);

window.addEventListener('load', () => {
  bgMusic.volume = 0.1;
  bgMusic.play().catch(() => {
    document.addEventListener('keydown', () => {
      if (bgMusic.paused) bgMusic.play();
    }, { once: true });
  });
});
