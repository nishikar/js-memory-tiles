const IMAGES = [
  'grandpa.png',
  'peppa.png',
  'daddy.png',
  'george.png',
  'pedro.png',
  'zoey.png',
  'rebecca.png',
  'gerald.png'
];

const FLIP_DURATION = 2000; // ms to show tiles before flipping back on no match

let tiles = [];
let flippedTiles = [];
let moves = 0;
let matches = 0;
let lockBoard = false;

const tilesContainer = document.getElementById('tiles');
const movesEl = document.getElementById('moves');
const matchesEl = document.getElementById('matches');
const resetBtn = document.getElementById('reset-btn');
const winMessage = document.getElementById('win-message');
const finalMovesEl = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createTiles() {
  const pairs = [...IMAGES, ...IMAGES];
  return shuffle(pairs);
}

function createTileElement(image, index) {
  const tile = document.createElement('div');
  tile.className = 'tile';
  tile.dataset.image = image;
  tile.dataset.index = index;

  tile.innerHTML = `
    <div class="tile-inner">
      <div class="tile-face tile-back"></div>
      <div class="tile-face tile-front">
        <img src="${image}" alt="Memory tile">
      </div>
    </div>
  `;

  tile.addEventListener('click', () => handleTileClick(tile));
  return tile;
}

function handleTileClick(tile) {
  if (lockBoard) return;
  if (tile.classList.contains('flipped') || tile.classList.contains('matched')) return;

  tile.classList.add('flipped');
  flippedTiles.push(tile);

  if (flippedTiles.length === 2) {
    lockBoard = true;
    moves++;
    movesEl.textContent = moves;

    const [first, second] = flippedTiles;
    if (first.dataset.image === second.dataset.image) {
      first.classList.add('matched');
      second.classList.add('matched');
      matches++;
      matchesEl.textContent = matches;
      flippedTiles = [];
      lockBoard = false;

      if (matches === IMAGES.length) {
        setTimeout(showWinMessage, 500);
      }
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        flippedTiles = [];
        lockBoard = false;
      }, FLIP_DURATION);
    }
  }
}

function showWinMessage() {
  finalMovesEl.textContent = moves;
  winMessage.classList.remove('hidden');
}

function initGame() {
  tiles = createTiles();
  flippedTiles = [];
  moves = 0;
  matches = 0;
  lockBoard = false;

  movesEl.textContent = '0';
  matchesEl.textContent = '0';
  winMessage.classList.add('hidden');

  tilesContainer.innerHTML = '';
  tiles.forEach((image, index) => {
    const tileEl = createTileElement(image, index);
    tilesContainer.appendChild(tileEl);
  });
}

resetBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => {
  initGame();
});

initGame();
