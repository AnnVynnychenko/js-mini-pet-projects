import { wins } from './data-wins.js';

const container = document.querySelector('.js-content');
const tableScore = document.querySelector('.js-score');
const winner = document.querySelector('.js-winner');
const resetScoreBtn = document.querySelector('.js-reset-score');

let textTimeoutId = null;
let resetTimeoutId = null;

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

function updateScore(scorePlayerX, scorePlayerO) {
  tableScore.innerHTML = ` <tr>
              <td class='player-data'>Player X</td>
              <td class=' player-data score'>${scorePlayerX}</td>
            </tr>
            <tr>
              <td class='player-data'>Player O</td>
              <td class='player-data score'>${scorePlayerO}</td>
            </tr>`;
}

function renderSymbol(id, symbol) {
  const item = container.querySelector(`[data-id='${id}']`);
  if (item) item.textContent = symbol;
}

function isWinner(arr) {
  return wins.some(item => item.every(id => arr.includes(id)));
}

function incrementScore(player) {
  if (player === 'X') {
    scorePlayerX += 1;
    localStorage.setItem('scorePlayerX', scorePlayerX);
  } else {
    scorePlayerO += 1;
    localStorage.setItem('scorePlayerO', scorePlayerO);
  }
  updateScore(scorePlayerX, scorePlayerO);
}

function handleEndGameText(gameResult, message) {
  gameResult.textContent = message;
  textTimeoutId = setTimeout(() => {
    gameResult.textContent = '';
  }, 2000);
}

function resetGameTime(playerType) {
  resetTimeoutId = setTimeout(() => {
    resetGame(playerType);
  }, 500);
}

function loadStateGame() {
  try {
    historyX = JSON.parse(localStorage.getItem('historyX')) || [];
    historyO = JSON.parse(localStorage.getItem('historyO')) || [];
    player = localStorage.getItem('player') || 'X';
    scorePlayerX = Number(localStorage.getItem('scorePlayerX')) || 0;
    scorePlayerO = Number(localStorage.getItem('scorePlayerO')) || 0;

    historyX.forEach(id => renderSymbol(id, 'X'));
    historyO.forEach(id => renderSymbol(id, 'O'));
  } catch (parseError) {
    console.error('Parsing error:', parseError.message);
  }
}

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
    handleEndGameText(winner, `Winner ${player} 😎🎉🎊`);
    incrementScore(player);
    const winningPlayer = player;
    resetGameTime(winningPlayer);
    return;
  }
  if (isEndGame) {
    handleEndGameText(winner, `Friendship prevailed`);
    const nextPlayer = player === 'X' ? 'O' : 'X';
    resetGameTime(nextPlayer);
    return;
  }

  player = player === 'X' ? 'O' : 'X';
  localStorage.setItem('player', player);
}

function resetHandler() {
  clearTimeout(textTimeoutId);
  clearTimeout(resetTimeoutId);
  winner.textContent = '';
  scorePlayerX = 0;
  scorePlayerO = 0;
  localStorage.removeItem('scorePlayerX');
  localStorage.removeItem('scorePlayerO');
  updateScore(scorePlayerX, scorePlayerO);
  resetGame('X');
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

createMarkupGameField();
loadStateGame();
updateScore(scorePlayerX, scorePlayerO);

container.addEventListener('click', onClick);
resetScoreBtn.addEventListener('click', resetHandler);
