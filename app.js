/**
 * Imposter Game — Preset categories + custom categories, purple theme
 */

const PRESETS = [
  { name: 'Animals', words: ['Dog', 'Cat', 'Lion', 'Elephant', 'Penguin', 'Dolphin', 'Owl', 'Bear'] },
  { name: 'Food & Drink', words: ['Pizza', 'Sushi', 'Coffee', 'Taco', 'Ice Cream', 'Burger', 'Pasta', 'Smoothie'] },
  { name: 'Movies', words: ['Star Wars', 'Titanic', 'Inception', 'Frozen', 'Jaws', 'Matrix', 'Avatar', 'Toy Story'] },
  { name: 'Sports', words: ['Soccer', 'Basketball', 'Tennis', 'Swimming', 'Surfing', 'Skiing', 'Boxing', 'Golf'] },
  { name: 'Jobs', words: ['Doctor', 'Teacher', 'Chef', 'Pilot', 'Artist', 'Engineer', 'Farmer', 'Musician'] },
  { name: 'Countries', words: ['Japan', 'Brazil', 'Italy', 'Egypt', 'Canada', 'Australia', 'India', 'France'] },
  { name: 'Superheroes', words: ['Batman', 'Superman', 'Wonder Woman', 'Spider-Man', 'Iron Man', 'Thor', 'Black Widow', 'Hulk'] },
  { name: 'Music', words: ['Guitar', 'Piano', 'Drums', 'Violin', 'Microphone', 'Concert', 'Album', 'DJ'] },
  { name: 'Nature', words: ['Mountain', 'Ocean', 'Forest', 'Desert', 'Waterfall', 'Sunset', 'Rainbow', 'Volcano'] },
  { name: 'Tech', words: ['Phone', 'Laptop', 'Robot', 'App', 'WiFi', 'Drone', 'VR', 'AI'] },
];

const MIN_WORDS = 4;
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

let state = {
  mode: null,           // 'preset' | 'custom'
  category: null,       // { name, words }
  playerCount: 4,
  playerNames: [],
  currentPlayerIndex: 0,
  wordsThisRound: [],   // shuffled words for this round
  imposterIndex: -1,    // index among players who got a word (0 = same word, 1 = imposter)
  votedFor: null,      // player index that was voted
};

const screens = {
  home: document.getElementById('screen-home'),
  presets: document.getElementById('screen-presets'),
  custom: document.getElementById('screen-custom'),
  players: document.getElementById('screen-players'),
  word: document.getElementById('screen-word'),
  reveal: document.getElementById('screen-reveal'),
  vote: document.getElementById('screen-vote'),
  results: document.getElementById('screen-results'),
};

function showScreen(id) {
  Object.values(screens).forEach(el => el.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function getCurrentCategory() {
  return state.category;
}

function goHome() {
  state.mode = null;
  state.category = null;
  showScreen('screen-home');
}

// ----- Preset list -----
function renderPresets() {
  const list = document.getElementById('preset-list');
  list.innerHTML = PRESETS.map((p) => `
    <button type="button" class="category-card" data-preset-id="${p.name}">
      <p class="name">${escapeHtml(p.name)}</p>
      <p class="count">${p.words.length} words</p>
    </button>
  `).join('');
  list.querySelectorAll('.category-card').forEach(btn => {
    btn.addEventListener('click', () => selectPreset(btn.dataset.presetId));
  });
}

function selectPreset(name) {
  const preset = PRESETS.find(p => p.name === name);
  if (!preset) return;
  state.mode = 'preset';
  state.category = { name: preset.name, words: [...preset.words] };
  showScreen('screen-players');
  initPlayerSection();
}

// ----- Custom category -----
function initCustomScreen() {
  const nameInput = document.getElementById('custom-name');
  const wordInput = document.getElementById('custom-word');
  const addBtn = document.getElementById('add-word-btn');
  const wordsList = document.getElementById('custom-words-list');
  const startBtn = document.getElementById('start-custom-btn');

  state.customWords = [];
  nameInput.value = '';
  wordInput.value = '';
  wordsList.innerHTML = '';
  updateCustomStartButton();

  function addWord() {
    const word = wordInput.value.trim();
    if (!word) return;
    state.customWords.push(word);
    wordInput.value = '';
    wordInput.focus();
    renderCustomWords();
    updateCustomStartButton();
  }

  function removeWord(index) {
    state.customWords.splice(index, 1);
    renderCustomWords();
    updateCustomStartButton();
  }

  function renderCustomWords() {
    wordsList.innerHTML = state.customWords.map((w, i) => `
      <li>
        ${escapeHtml(w)}
        <button type="button" aria-label="Remove ${escapeHtml(w)}" data-index="${i}">×</button>
      </li>
    `).join('');
    wordsList.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => removeWord(parseInt(btn.dataset.index, 10)));
    });
  }

  function updateCustomStartButton() {
    const nameOk = nameInput.value.trim().length > 0;
    startBtn.disabled = !(nameOk && state.customWords.length >= MIN_WORDS);
  }

  addBtn.addEventListener('click', addWord);
  wordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addWord(); });
  nameInput.addEventListener('input', updateCustomStartButton);

  startBtn.onclick = () => {
    const categoryName = nameInput.value.trim();
    if (!categoryName || state.customWords.length < MIN_WORDS) return;
    state.mode = 'custom';
    state.category = { name: categoryName, words: [...state.customWords] };
    showScreen('screen-players');
    initPlayerSection();
  };
}

// ----- Player count -----
function initPlayerSection() {
  const range = document.getElementById('player-count');
  const display = document.getElementById('player-count-display');
  range.min = MIN_PLAYERS;
  range.max = MAX_PLAYERS;
  range.value = state.playerCount;
  display.textContent = state.playerCount;
  range.addEventListener('input', () => {
    state.playerCount = parseInt(range.value, 10);
    display.textContent = state.playerCount;
  });
  document.getElementById('start-game-btn').onclick = startRound;
}

function startRound() {
  const cat = getCurrentCategory();
  if (!cat || cat.words.length < 2) return;

  state.playerNames = Array.from({ length: state.playerCount }, (_, i) => `Player ${i + 1}`);
  state.currentPlayerIndex = 0;
  state.votedFor = null;

  const wordPool = [...cat.words];
  shuffle(wordPool);
  const realWord = wordPool[0];
  state.wordsThisRound = [];
  for (let i = 0; i < state.playerCount; i++) {
    state.wordsThisRound.push(i === 0 ? realWord : realWord);
  }
  state.imposterIndex = Math.floor(Math.random() * state.playerCount);
  const imposterWord = wordPool[1] ?? wordPool[0];
  state.wordsThisRound[state.imposterIndex] = imposterWord;

  showScreen('screen-word');
  updateWordScreenPlayer();
}

function updateWordScreenPlayer() {
  const name = state.playerNames[state.currentPlayerIndex];
  document.getElementById('current-player-name').textContent = name;
  document.getElementById('show-word-btn').onclick = () => showReveal();
}

function showReveal() {
  const word = state.wordsThisRound[state.currentPlayerIndex];
  const isImposter = state.currentPlayerIndex === state.imposterIndex;
  document.getElementById('role-label').textContent = isImposter ? "Imposter's word" : 'Your word';
  document.getElementById('word-display').textContent = word;
  showScreen('screen-reveal');
  document.getElementById('done-reading-btn').onclick = () => doneReading();
}

function doneReading() {
  state.currentPlayerIndex++;
  if (state.currentPlayerIndex < state.playerCount) {
    showScreen('screen-word');
    updateWordScreenPlayer();
  } else {
    showScreen('screen-vote');
    renderVote();
  }
}

function renderVote() {
  const list = document.getElementById('vote-list');
  list.innerHTML = '';
  state.playerNames.forEach((name, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vote-option';
    btn.textContent = name;
    btn.dataset.index = i;
    btn.addEventListener('click', () => {
      list.querySelectorAll('.vote-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.votedFor = i;
    });
    list.appendChild(btn);
  });
  document.getElementById('reveal-imposter-btn').onclick = revealImposter;
}

function revealImposter() {
  const imposter = state.imposterIndex;
  const name = state.playerNames[imposter];
  document.getElementById('results-title').textContent = 'Imposter was…';
  document.getElementById('imposter-name').textContent = name;
  showScreen('screen-results');
  document.getElementById('play-again-btn').onclick = () => {
    startRound();
  };
  document.getElementById('new-category-btn').onclick = () => {
    if (state.mode === 'preset') {
      showScreen('screen-presets');
      renderPresets();
    } else {
      showScreen('screen-custom');
      initCustomScreen();
    }
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ----- Navigation -----
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const screen = btn.closest('.screen');
    if (screen.id === 'screen-presets' || screen.id === 'screen-custom' || screen.id === 'screen-players') {
      if (screen.id === 'screen-players') {
        if (state.mode === 'preset') showScreen('screen-presets');
        else showScreen('screen-custom');
      } else {
        goHome();
      }
    }
  });
});

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === 'preset') {
      showScreen('screen-presets');
      renderPresets();
    } else if (mode === 'custom') {
      showScreen('screen-custom');
      initCustomScreen();
    }
  });
});

// Start
renderPresets();
