/**
 * Imposter Game — Preset + custom categories, auth, saved categories (Firebase)
 */

// Firebase: only init if config is set
let firebaseApp = null;
let auth = null;
let db = null;
const FIREBASE_ENABLED = typeof FIREBASE_CONFIG !== 'undefined' &&
  FIREBASE_CONFIG.apiKey &&
  FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY';

if (FIREBASE_ENABLED) {
  firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
  auth = firebase.auth();
  db = firebase.firestore();
}

const PRESETS = [
  {
    name: 'Animals',
    words: [
      'Dog', 'Cat', 'Lion', 'Elephant', 'Penguin', 'Dolphin', 'Owl', 'Bear',
      'Tiger', 'Giraffe', 'Kangaroo', 'Panda', 'Zebra', 'Wolf', 'Fox', 'Rabbit',
      'Horse', 'Cow', 'Sheep', 'Goat', 'Pig', 'Chicken', 'Duck', 'Eagle'
    ]
  },
  {
    name: 'Food & Drink',
    words: [
      'Pizza', 'Sushi', 'Coffee', 'Taco', 'Ice Cream', 'Burger', 'Pasta', 'Smoothie',
      'Steak', 'Salad', 'Sandwich', 'Fries', 'Ramen', 'Pancakes', 'Donut', 'Tea',
      'Nachos', 'Burrito', 'Curry', 'Soup', 'Cake', 'Pie', 'Chocolate', 'Milkshake'
    ]
  },
  {
    name: 'Movies',
    words: [
      'Star Wars', 'Titanic', 'Inception', 'Frozen', 'Jaws', 'Matrix', 'Avatar', 'Toy Story',
      'Jurassic Park', 'The Godfather', 'Harry Potter', 'Lord of the Rings',
      'Avengers', 'Gladiator', 'Shrek', 'Interstellar',
      'Dark Knight', 'Forrest Gump', 'Pulp Fiction', 'Rocky', 'Alien', 'Up', 'Coco', 'Dune'
    ]
  },
  {
    name: 'Sports',
    words: [
      'Soccer', 'Basketball', 'Tennis', 'Swimming', 'Surfing', 'Skiing', 'Boxing', 'Golf',
      'Baseball', 'Football', 'Hockey', 'Volleyball', 'Running', 'Cycling',
      'Wrestling', 'Cricket', 'Rugby', 'Skateboarding', 'Snowboarding', 'MMA',
      'Lacrosse', 'Badminton', 'Rowing', 'Fencing'
    ]
  },
  {
    name: 'Jobs',
    words: [
      'Doctor', 'Teacher', 'Chef', 'Pilot', 'Artist', 'Engineer', 'Farmer', 'Musician',
      'Lawyer', 'Nurse', 'Firefighter', 'Police Officer', 'Scientist', 'Architect',
      'Journalist', 'Photographer', 'Dentist', 'Therapist', 'Electrician', 'Plumber',
      'Mechanic', 'Designer', 'Producer', 'Consultant'
    ]
  },
  {
    name: 'Countries',
    words: [
      'Japan', 'Brazil', 'Italy', 'Egypt', 'Canada', 'Australia', 'India', 'France',
      'Germany', 'Spain', 'Mexico', 'China', 'South Korea', 'Nigeria',
      'Argentina', 'United Kingdom', 'Sweden', 'Norway', 'Greece', 'Turkey',
      'Thailand', 'Vietnam', 'Chile', 'Peru'
    ]
  },
  {
    name: 'Superheroes',
    words: [
      'Batman', 'Superman', 'Wonder Woman', 'Spider-Man', 'Iron Man', 'Thor', 'Black Widow', 'Hulk',
      'Captain America', 'Flash', 'Aquaman', 'Green Lantern',
      'Doctor Strange', 'Black Panther', 'Scarlet Witch', 'Ant-Man',
      'Wolverine', 'Deadpool', 'Daredevil', 'Punisher', 'Storm', 'Cyclops', 'Loki', 'Vision'
    ]
  },
  {
    name: 'Music',
    words: [
      'Guitar', 'Piano', 'Drums', 'Violin', 'Microphone', 'Concert', 'Album', 'DJ',
      'Singer', 'Band', 'Lyrics', 'Melody', 'Bass', 'Headphones',
      'Playlist', 'Record', 'Producer', 'Remix', 'Encore', 'Festival',
      'Stage', 'Tour', 'Chord', 'Beat'
    ]
  },
  {
    name: 'Nature',
    words: [
      'Mountain', 'Ocean', 'Forest', 'Desert', 'Waterfall', 'Sunset', 'Rainbow', 'Volcano',
      'River', 'Lake', 'Canyon', 'Glacier', 'Island', 'Beach',
      'Thunderstorm', 'Aurora', 'Tornado', 'Hurricane', 'Earthquake',
      'Cliff', 'Valley', 'Swamp', 'Reef', 'Savanna'
    ]
  },
  {
    name: 'Tech',
    words: [
      'Phone', 'Laptop', 'Robot', 'App', 'WiFi', 'Drone', 'VR', 'AI',
      'Tablet', 'Smartwatch', 'Server', 'Cloud', 'Bluetooth',
      'Keyboard', 'Monitor', 'Microchip', 'Firewall', 'Database',
      'API', 'Algorithm', 'Startup', 'Bug', 'Patch', 'Browser'
    ]
  },
  {
    name: 'NSFW Adult',
    words: [
      'Hookup', 'One-Night Stand', 'Friends with Benefits', 'Thirst Trap',
      'Nudes', 'Late-Night Text', 'Sneaky Link', 'Booty Call',
      'Foreplay', 'Kinky', 'Turn-On', 'Turn-Off',
      'Fantasy', 'Roleplay', 'Dirty Talk', 'After Dark',
      'Make Out', 'Bedroom Eyes', 'Flirting', 'Chemistry',
      'Walk of Shame', 'Cuffed', 'Uncuffed', 'Hot Mess'
    ]
  },
  {
    name: 'Dating Chaos',
    words: [
      'Ghosted', 'Breadcrumbing', 'Love Bombing', 'Red Flag',
      'Green Flag', 'Situationship', 'Soft Launch', 'Hard Launch',
      'Ex Drama', 'Rebound', 'Drunk Text', 'Read Receipts',
      'Left on Seen', 'Toxic', 'Clingy', 'Emotionally Unavailable',
      'Jealous', 'Overthinking', 'Mixed Signals', 'Third Date Rule',
      'Netflix and Chill', 'Awkward Silence', 'Spicy Text', 'Heartbreak'
    ]
  }
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
  firstSpeakerIndex: null,  // random player who goes first in discussion (set when entering vote)
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

// ----- Auth -----
function initAuth() {
  if (!FIREBASE_ENABLED) {
    document.getElementById('auth-buttons').style.display = 'none';
    return;
  }
  const authHeader = document.getElementById('auth-header');
  const authButtons = document.getElementById('auth-buttons');
  const authDisplay = document.getElementById('auth-display');
  const signInBtn = document.getElementById('sign-in-btn');
  const signOutBtn = document.getElementById('sign-out-btn');
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  const authModal = document.getElementById('auth-modal');
  const authForm = document.getElementById('auth-form');
  const authModalTitle = document.getElementById('auth-modal-title');
  const authNameRow = document.getElementById('auth-name-row');
  const authNameInput = document.getElementById('auth-name-input');
  const authEmailInput = document.getElementById('auth-email-input');
  const authPasswordInput = document.getElementById('auth-password-input');
  const authError = document.getElementById('auth-error');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authToggleMode = document.getElementById('auth-toggle-mode');
  const authClose = document.getElementById('auth-close');

  const deleteAccountModal = document.getElementById('delete-account-modal');
  const deleteAccountPassword = document.getElementById('delete-account-password');
  const deleteAccountError = document.getElementById('delete-account-error');
  const deleteAccountCancel = document.getElementById('delete-account-cancel');
  const deleteAccountConfirm = document.getElementById('delete-account-confirm');
  const deleteAccountClose = document.getElementById('delete-account-close');

  let isSignUp = false;

  function displayNameForUser(user) {
    const name = user.displayName && user.displayName.trim();
    return name ? name : user.email;
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      authHeader.style.display = 'flex';
      authDisplay.textContent = displayNameForUser(user);
      authButtons.style.display = 'none';
    } else {
      authHeader.style.display = 'none';
      authDisplay.textContent = '';
      authButtons.style.display = 'block';
    }
  });

  signInBtn.addEventListener('click', () => {
    isSignUp = false;
    authModalTitle.textContent = 'Sign in';
    authSubmitBtn.textContent = 'Sign in';
    authToggleMode.textContent = 'Create an account';
    authNameRow.style.display = 'none';
    authNameInput.removeAttribute('required');
    authError.textContent = '';
    authModal.classList.add('open');
  });

  signOutBtn.addEventListener('click', () => auth.signOut());

  deleteAccountBtn.addEventListener('click', () => {
    deleteAccountError.textContent = '';
    deleteAccountPassword.value = '';
    deleteAccountModal.classList.add('open');
  });

  deleteAccountCancel.addEventListener('click', () => deleteAccountModal.classList.remove('open'));
  deleteAccountClose.addEventListener('click', () => deleteAccountModal.classList.remove('open'));
  deleteAccountModal.addEventListener('click', (e) => {
    if (e.target === deleteAccountModal) deleteAccountModal.classList.remove('open');
  });

  deleteAccountConfirm.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user || !user.email) return;
    const password = deleteAccountPassword.value;
    if (!password) {
      deleteAccountError.textContent = 'Enter your password to confirm';
      return;
    }
    deleteAccountError.textContent = '';
    deleteAccountConfirm.disabled = true;
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
      await user.reauthenticateWithCredential(credential);
      const ref = userCategoriesRef();
      if (ref) {
        const snap = await ref.get();
        const batch = db.batch();
        snap.docs.forEach((d) => batch.delete(d.ref));
        if (!snap.empty) await batch.commit();
      }
      await user.delete();
      deleteAccountModal.classList.remove('open');
    } catch (err) {
      deleteAccountError.textContent = err.message || 'Could not delete account';
    }
    deleteAccountConfirm.disabled = false;
  });

  authClose.addEventListener('click', () => authModal.classList.remove('open'));
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('open');
  });

  authToggleMode.addEventListener('click', () => {
    isSignUp = !isSignUp;
    authModalTitle.textContent = isSignUp ? 'Create account' : 'Sign in';
    authSubmitBtn.textContent = isSignUp ? 'Create account' : 'Sign in';
    authToggleMode.textContent = isSignUp ? 'Already have an account? Sign in' : 'Create an account';
    authNameRow.style.display = isSignUp ? 'block' : 'none';
    authNameInput.required = isSignUp;
    authError.textContent = '';
  });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.textContent = '';
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    if (!email || !password) return;
    if (isSignUp) {
      const name = authNameInput.value.trim();
      if (!name) {
        authError.textContent = 'Please enter your name';
        return;
      }
    }
    authSubmitBtn.disabled = true;
    try {
      if (isSignUp) {
        const name = authNameInput.value.trim();
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        if (userCred.user && name) {
          await userCred.user.updateProfile({ displayName: name });
        }
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      authModal.classList.remove('open');
      authForm.reset();
    } catch (err) {
      authError.textContent = err.message || 'Something went wrong';
    }
    authSubmitBtn.disabled = false;
  });
}

// ----- Saved categories (Firestore) -----
function userCategoriesRef() {
  if (!auth || !db || !auth.currentUser) return null;
  return db.collection('users').doc(auth.currentUser.uid).collection('categories');
}

async function loadSavedCategories() {
  const ref = userCategoriesRef();
  if (!ref) return [];
  const snap = await ref.get();
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  list.sort((a, b) => (b.updatedAt?.toMillis?.() ?? 0) - (a.updatedAt?.toMillis?.() ?? 0));
  return list;
}

async function saveCategory(category) {
  const ref = userCategoriesRef();
  if (!ref || !FIREBASE_ENABLED) return null;
  const doc = {
    name: category.name,
    words: category.words,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  const docRef = await ref.add(doc);
  return docRef.id;
}

async function deleteSavedCategory(id) {
  const ref = userCategoriesRef();
  if (!ref) return;
  await ref.doc(id).delete();
}

// ----- Custom category -----
function initCustomScreen() {
  const nameInput = document.getElementById('custom-name');
  const wordInput = document.getElementById('custom-word');
  const addBtn = document.getElementById('add-word-btn');
  const wordsList = document.getElementById('custom-words-list');
  const startBtn = document.getElementById('start-custom-btn');
  const savedBlock = document.getElementById('saved-categories-block');
  const savedList = document.getElementById('saved-categories-list');

  state.customWords = [];
  nameInput.value = '';
  wordInput.value = '';
  wordsList.innerHTML = '';
  updateCustomStartButton();

  // Load and show saved categories if signed in
  (async () => {
    if (!FIREBASE_ENABLED || !auth?.currentUser) {
      savedBlock.style.display = 'none';
      return;
    }
    const saved = await loadSavedCategories();
    if (saved.length === 0) {
      savedBlock.style.display = 'none';
      return;
    }
    savedBlock.style.display = 'block';
    savedList.innerHTML = saved.map((cat) => `
      <div class="category-card saved-category" data-category-id="${escapeHtml(cat.id)}">
        <p class="name">${escapeHtml(cat.name)}</p>
        <p class="count">${cat.words?.length ?? 0} words</p>
        <button type="button" class="btn-delete-category" data-category-id="${escapeHtml(cat.id)}" aria-label="Delete category">Delete</button>
      </div>
    `).join('');
    savedList.querySelectorAll('.saved-category').forEach(el => {
      const id = el.dataset.categoryId;
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-category')) return;
        const cat = saved.find(c => c.id === id);
        if (cat && cat.words && cat.words.length >= 2) {
          state.mode = 'custom';
          state.category = { name: cat.name, words: [...cat.words] };
          showScreen('screen-players');
          initPlayerSection();
        }
      });
    });
    savedList.querySelectorAll('.btn-delete-category').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm('Delete this category?')) return;
        await deleteSavedCategory(btn.dataset.categoryId);
        initCustomScreen();
      });
    });
  })();

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

  startBtn.onclick = async () => {
    const categoryName = nameInput.value.trim();
    if (!categoryName || state.customWords.length < MIN_WORDS) return;
    state.mode = 'custom';
    state.category = { name: categoryName, words: [...state.customWords] };
    if (FIREBASE_ENABLED && auth?.currentUser) {
      try {
        await saveCategory(state.category);
      } catch (_) { /* ignore */ }
    }
    showScreen('screen-players');
    initPlayerSection();
  };
}

// ----- Player count & names -----
function initPlayerSection() {
  const select = document.getElementById('player-count');
  const namesList = document.getElementById('player-names-list');
  select.value = String(state.playerCount);

  function renderPlayerNameInputs() {
    const count = parseInt(select.value, 10);
    state.playerCount = count;
    namesList.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const row = document.createElement('div');
      row.className = 'player-name-row';
      const label = document.createElement('label');
      label.textContent = `Player ${i + 1}`;
      label.htmlFor = `player-name-${i}`;
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `player-name-${i}`;
      input.placeholder = `Player ${i + 1}`;
      input.maxLength = 25;
      input.setAttribute('aria-label', `Name for player ${i + 1}`);
      row.appendChild(label);
      row.appendChild(input);
      namesList.appendChild(row);
    }
  }

  renderPlayerNameInputs();
  select.addEventListener('change', renderPlayerNameInputs);
  document.getElementById('start-game-btn').onclick = startRound;
}

function getPlayerNamesFromInputs() {
  const names = [];
  for (let i = 0; i < state.playerCount; i++) {
    const input = document.getElementById(`player-name-${i}`);
    const value = input ? input.value.trim() : '';
    names.push(value || `Player ${i + 1}`);
  }
  return names;
}

function startRound() {
  const cat = getCurrentCategory();
  if (!cat || cat.words.length < 2) return;

  state.playerNames = getPlayerNamesFromInputs();
  state.currentPlayerIndex = 0;
  state.votedFor = null;

  const wordPool = [...cat.words];
  shuffle(wordPool);
  const realWord = wordPool[0];
  state.imposterIndex = Math.floor(Math.random() * state.playerCount);
  // Everyone gets the same real word; imposter sees "Imposter" in red (handled in showReveal)
  state.wordsThisRound = Array(state.playerCount).fill(realWord);

  showScreen('screen-word');
  updateWordScreenPlayer();
}

function updateWordScreenPlayer() {
  const name = state.playerNames[state.currentPlayerIndex];
  document.getElementById('current-player-name').textContent = name;
  document.getElementById('show-word-btn').onclick = () => showReveal();
}

function showReveal() {
  const isImposter = state.currentPlayerIndex === state.imposterIndex;
  const wordEl = document.getElementById('word-display');
  const labelEl = document.getElementById('role-label');
  if (isImposter) {
    labelEl.textContent = "You're the imposter";
    wordEl.textContent = 'Imposter';
    wordEl.classList.add('imposter-word');
  } else {
    labelEl.textContent = 'Your word';
    wordEl.textContent = state.wordsThisRound[state.currentPlayerIndex];
    wordEl.classList.remove('imposter-word');
  }
  showScreen('screen-reveal');
  document.getElementById('done-reading-btn').onclick = () => doneReading();
}

function doneReading() {
  state.currentPlayerIndex++;
  if (state.currentPlayerIndex < state.playerCount) {
    showScreen('screen-word');
    updateWordScreenPlayer();
  } else {
    state.firstSpeakerIndex = Math.floor(Math.random() * state.playerCount);
    showScreen('screen-vote');
    renderVote();
  }
}

function renderVote() {
  const firstSpeakerEl = document.getElementById('vote-first-speaker');
  const firstIndex = state.firstSpeakerIndex;
  if (firstSpeakerEl && firstIndex != null && state.playerNames[firstIndex]) {
    const name = state.playerNames[firstIndex];
    firstSpeakerEl.textContent = `${name} goes first. Take turns going clockwise from them.`;
    firstSpeakerEl.style.display = 'block';
  } else if (firstSpeakerEl) {
    firstSpeakerEl.style.display = 'none';
  }

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
initAuth();
renderPresets();
