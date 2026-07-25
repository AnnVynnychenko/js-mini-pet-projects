import { wins } from './data-wins.js';

const container = document.querySelector('.js-content');
const tableScore = document.querySelector('.js-score');
const winner = document.querySelector('.js-winner');
const resetScoreBtn = document.querySelector('.js-reset-score');

container.addEventListener('click', onClick);
resetScoreBtn.addEventListener('click', resetHandler);
let player = 'X';
let historyX = [];
let historyO = [];
let scorePlayerX = 0;
let scorePlayerO = 0;

function createMarkupGameField() {
  let markup = '';
  for (let i = 1; i < 10; i += 1) {
    markup += `<div class="item js-item" data-id = ${i}></div>`;
  }
  container.innerHTML = markup;
}

createMarkupGameField();

function loadStateGame() {
  try {
    const savedHistoryX = JSON.parse(localStorage.getItem('historyX')) || [];
    const savedHistoryO = JSON.parse(localStorage.getItem('historyO')) || [];
    const savedPlayer = localStorage.getItem('player') || 'X';
    const savedScorePlayerX = Number(localStorage.getItem('scorePlayerX')) || 0;
    const savedScorePlayerO = Number(localStorage.getItem('scorePlayerO')) || 0;

    historyX = savedHistoryX;
    historyO = savedHistoryO;
    player = savedPlayer;
    scorePlayerX = savedScorePlayerX;
    scorePlayerO = savedScorePlayerO;

    historyX.forEach(id => {
      const item = container.querySelector(`[data-id='${id}']`);
      if (item) item.textContent = 'X';
    });
    historyO.forEach(id => {
      const item = container.querySelector(`[data-id='${id}']`);
      if (item) item.textContent = 'O';
    });
  } catch (parseError) {
    console.error('Parsing error:', parseError.message);
  }
}

loadStateGame();

function updateScore(scorePlayerX, scorePlayerO) {
  const markupTableScore = ` <tr>
              <td class='player-data'>Player X</td>
              <td class=' player-data score'>${scorePlayerX}</td>
            </tr>
            <tr>
              <td class='player-data'>Player O</td>
              <td class='player-data score'>${scorePlayerO}</td>
            </tr>`;

  tableScore.innerHTML = markupTableScore;
}

updateScore(scorePlayerX, scorePlayerO);

function onClick(evt) {
  const { target } = evt;
  if (!target.classList.contains('js-item') || target.textContent) return;

  let result = false;
  const id = Number(target.dataset.id);

  if (player === 'X') {
    historyX.push(id);
    localStorage.setItem('historyX', JSON.stringify(historyX));
    result = isWinner(historyX);
  } else {
    historyO.push(id);
    localStorage.setItem('historyO', JSON.stringify(historyO));
    result = isWinner(historyO);
  }

  target.textContent = player;

  const isEndGame = historyX.length + historyO.length === 9;

  if (result) {
    winner.textContent = `Winner ${player} 😎🎉🎊`;
    setTimeout(() => {
      winner.textContent = '';
    }, 2000);
    if (player === 'X') {
      scorePlayerX += 1;
      localStorage.setItem('scorePlayerX', scorePlayerX);
      updateScore(scorePlayerX, scorePlayerO);
    } else {
      scorePlayerO += 1;
      localStorage.setItem('scorePlayerO', scorePlayerO);
      updateScore(scorePlayerX, scorePlayerO);
    }
    const winningPlayer = player;
    setTimeout(() => {
      resetGame(winningPlayer);
    }, 500);
    return;
  } else if (isEndGame) {
    winner.textContent = `Friendship prevailed`;
    setTimeout(() => {
      winner.textContent = '';
    }, 2000);
    const nextPlayer = player === 'X' ? 'O' : 'X';
    setTimeout(() => {
      resetGame(nextPlayer);
    }, 500);
    return;
  }

  player = player === 'X' ? 'O' : 'X';
  localStorage.setItem('player', player);
}

function resetHandler() {
  scorePlayerX = 0;
  scorePlayerO = 0;
  localStorage.removeItem('scorePlayerX');
  localStorage.removeItem('scorePlayerO');
  updateScore(scorePlayerX, scorePlayerO);
  resetGame('X');
}

function isWinner(arr) {
  return wins.some(item => item.every(id => arr.includes(id)));
}

function resetGame(nextFirstPlayer) {
  createMarkupGameField();
  historyX = [];
  historyO = [];
  player = nextFirstPlayer || player || 'X';
  localStorage.removeItem('historyX');
  localStorage.removeItem('historyO');
  localStorage.setItem('player', player);
}
