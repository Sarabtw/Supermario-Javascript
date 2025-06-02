const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

let score = 0;
let isGameOver = false;


let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;

const jumpSound = new Audio('audio/jump-mario.mp3');
const gameOverSound = new Audio('audio/game-over.mp3');

const jump = () => {
  if (isGameOver) return; 

  mario.classList.add('jump');

  jumpSound.currentTime = 0;
  jumpSound.play();

  setTimeout(() => {
    mario.classList.remove('jump');
  }, 500);
}

const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

  if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
    
    isGameOver = true;

    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    mario.src = "img/game-over.png";
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';

    gameOverSound.play();

    clearInterval(loop);

    
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      highScoreElement.textContent = highScore;
    }

  } else {
    score++;
    scoreElement.textContent = score;
  }
}, 100);

document.addEventListener('keydown', jump);
