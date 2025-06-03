const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const livesElement = document.getElementById('lives');
const bgMusic = document.getElementById('bg-music');

const jumpSound = new Audio('audio/jump-mario.mp3');
const gameOverSound = new Audio('audio/game-over.mp3');

let score = 0;
let lives = 3;
let isGameOver = false;

let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;

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

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreElement.textContent = highScore;
    }
  } else {
   
    resetPipePosition();

    
    mario.style.filter = 'brightness(0.7)';
    setTimeout(() => {
      mario.style.filter = 'none';
    }, 500);
  }
};

const loop = setInterval(() => {
  if (isGameOver) return;

  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    handleCollision();
  }
}, 10);

const scoreInterval = setInterval(() => {
  if (!isGameOver) {
    score++;
    scoreElement.textContent = score;
  }
}, 500);

document.addEventListener('keydown', jump);


window.addEventListener('load', () => {
  bgMusic.volume = 0.5;
  bgMusic.play().catch(() => {
   
    document.addEventListener('keydown', () => {
      if (bgMusic.paused) bgMusic.play();
    }, { once: true });
  });
});
