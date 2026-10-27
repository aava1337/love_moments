// 1. Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#181124');
  tg.setBackgroundColor('#0D0914');
}

// 2. Навигация по главным вкладкам
const tabHome = document.getElementById('tab-home');
const tabAlbum = document.getElementById('tab-album');
const tabGames = document.getElementById('tab-games');

const screenHome = document.getElementById('screen-home');
const screenAlbum = document.getElementById('screen-album');
const screenGames = document.getElementById('screen-games');

function showTab(tabName) {
  const tabs = [
    { btn: tabHome, scr: screenHome, name: 'home' },
    { btn: tabAlbum, scr: screenAlbum, name: 'album' },
    { btn: tabGames, scr: screenGames, name: 'games' }
  ];

  tabs.forEach(t => {
    if (t.name === tabName) {
      t.btn?.classList.add('active');
      if (t.scr) {
        t.scr.classList.add('active');
        t.scr.style.setProperty('display', 'flex', 'important');
      }
    } else {
      t.btn?.classList.remove('active');
      if (t.scr) {
        t.scr.classList.remove('active');
        t.scr.style.setProperty('display', 'none', 'important');
      }
    }
  });
}

showTab('home');

tabHome?.addEventListener('click', () => {
  showTab('home');
  if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
});

tabAlbum?.addEventListener('click', () => {
  showTab('album');
  if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
});

tabGames?.addEventListener('click', () => {
  showTab('games');
  if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
});

document.getElementById('tab-vip')?.addEventListener('click', () => {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  alert('Раздел VIP скоро станет доступен! ⭐');
});

// Переключение подвкладок в играх
const subtabArcade = document.getElementById('subtab-arcade');
const subtabQa = document.getElementById('subtab-qa');
const viewArcade = document.getElementById('view-arcade');
const viewQa = document.getElementById('view-qa');

subtabArcade?.addEventListener('click', () => {
  subtabArcade.classList.add('active');
  subtabQa.classList.remove('active');
  if (viewArcade) viewArcade.style.setProperty('display', 'flex', 'important');
  if (viewQa) viewQa.style.setProperty('display', 'none', 'important');
  if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
});

subtabQa?.addEventListener('click', () => {
  subtabQa.classList.add('active');
  subtabArcade.classList.remove('active');
  if (viewQa) viewQa.style.setProperty('display', 'flex', 'important');
  if (viewArcade) viewArcade.style.setProperty('display', 'none', 'important');
  if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
});

// 3. Параметры из URL
const urlParams = new URLSearchParams(window.location.search);

const paramStartDate = urlParams.get('start_date');
const paramStreak = Number(urlParams.get('streak') || '1');
const paramU1Id = Number(urlParams.get('u1_id') || '0');
const paramU2Id = Number(urlParams.get('u2_id') || '0');
const paramU1Name = urlParams.get('u1_name') || 'Партнер 1';
const paramU2Name = urlParams.get('u2_name') || 'Партнер 2';
const paramU1User = urlParams.get('u1_user') || '';
const paramU2User = urlParams.get('u2_user') || '';
const paramU1Sent = urlParams.get('u1_sent') === '1';
const paramU2Sent = urlParams.get('u2_sent') === '1';
const paramPhotos = urlParams.get('photos') || '';
const paramBotToken = urlParams.get('bot_token') || '';
const paramQText = urlParams.get('q_text') || 'Какое наше совместное воспоминание самое теплое? ✨';

const streakEl = document.getElementById('streak-count');
if (streakEl) streakEl.innerText = paramStreak;

const currentTgUser = tg?.initDataUnsafe?.user;
const currentTgId = currentTgUser ? Number(currentTgUser.id) : null;
const isUser1 = (!currentTgId || currentTgId !== paramU2Id);

const myName = isUser1 ? paramU1Name : paramU2Name;
const partnerName = isUser1 ? paramU2Name : paramU1Name;
const partnerId = isUser1 ? paramU2Id : paramU1Id;

// ==========================================
// 4. КАТАЛОГ ШМОТОК И КАСТОМИЗАЦИЯ МОНСТРИКА
// ==========================================
const WARDROBE_ITEMS = [
  // Базовые (0 дней)
  { id: 'bow', name: 'Розовый бантик', ico: '🎀', reqStreak: 0, price: 25, svgId: 'acc-bow' },
  { id: 'glasses', name: 'Очки ботаника', ico: '👓', reqStreak: 0, price: 40, svgId: 'acc-glasses' },
  
  // 7+ дней
  { id: 'scarf', name: 'Вязаный шарфик', ico: '🧣', reqStreak: 7, price: 65, svgId: 'acc-scarf' },
  { id: 'cap', name: 'Кепка назад', ico: '🧢', reqStreak: 7, price: 80, svgId: 'acc-cap' },
  { id: 'bandaid', name: 'Милый пластырь', ico: '🩹', reqStreak: 7, price: 50, svgId: 'acc-bandaid' },
  
  // 15+ дней
  { id: 'sleepcap', name: 'Колпак для снов', ico: '💤', reqStreak: 15, price: 110, svgId: 'acc-sleepcap' },
  { id: 'mustache', name: 'Усы сыщика', ico: '🥸', reqStreak: 15, price: 95, svgId: 'acc-mustache' },
  
  // 30+ дней
  { id: 'partyhat', name: 'Колпак пати', ico: '🥳', reqStreak: 30, price: 160, svgId: 'acc-partyhat' },
  { id: 'flower', name: 'Цветок в зубах', ico: '🌹', reqStreak: 30, price: 140, svgId: 'acc-flower' },
  { id: 'sunglasses', name: 'Тёмные очки', ico: '😎', reqStreak: 30, price: 200, svgId: 'acc-sunglasses' }
];

// Управление балансом сердечек
function getHeartCoins() {
  const saved = localStorage.getItem('user_heart_coins');
  return saved !== null ? Number(saved) : 60; // 60 приветственных сердец
}

function setHeartCoins(val) {
  localStorage.setItem('user_heart_coins', val);
  const badge = document.getElementById('heart-coins-val');
  if (badge) badge.innerText = val;
}

// Купленные и надетые вещи
function getOwnedItems() {
  return JSON.parse(localStorage.getItem('owned_accessories') || '[]');
}

function addOwnedItem(itemId) {
  const owned = getOwnedItems();
  if (!owned.includes(itemId)) {
    owned.push(itemId);
    localStorage.setItem('owned_accessories', JSON.stringify(owned));
  }
}

function getEquippedItem() {
  return urlParams.get('eq_item') || localStorage.getItem('equipped_accessory') || null;
}

function setEquippedItem(itemId) {
  if (itemId) {
    localStorage.setItem('equipped_accessory', itemId);
  } else {
    localStorage.removeItem('equipped_accessory');
  }
  applyAccessoryToSvg(itemId);
}

function applyAccessoryToSvg(activeId) {
  WARDROBE_ITEMS.forEach(it => {
    const el = document.getElementById(it.svgId);
    if (el) el.style.display = (it.id === activeId) ? 'block' : 'none';
  });
}

// Логика шторки гардероба
function setupWardrobeUI() {
  const sheet = document.getElementById('wardrobe-sheet');
  const backdrop = document.getElementById('wardrobe-backdrop');
  const openBtn = document.getElementById('btn-open-wardrobe');
  const grid = document.getElementById('wardrobe-grid');
  const tryonBanner = document.getElementById('tryon-banner');
  const tryonName = document.getElementById('tryon-item-name');
  const cancelTryonBtn = document.getElementById('btn-cancel-tryon');

  let previewItem = null;

  setHeartCoins(getHeartCoins());
  applyAccessoryToSvg(getEquippedItem());

  openBtn?.addEventListener('click', () => {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    renderGrid();
    sheet?.classList.add('open');
  });

  function closeSheet() {
    sheet?.classList.remove('open');
    if (previewItem) {
      previewItem = null;
      tryonBanner.style.display = 'none';
      applyAccessoryToSvg(getEquippedItem());
    }
  }

  backdrop?.addEventListener('click', closeSheet);

  cancelTryonBtn?.addEventListener('click', () => {
    previewItem = null;
    tryonBanner.style.display = 'none';
    applyAccessoryToSvg(getEquippedItem());
    renderGrid();
  });

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = '';

    const owned = getOwnedItems();
    const equipped = getEquippedItem();
    const currentStreak = paramStreak;
    const coins = getHeartCoins();

    WARDROBE_ITEMS.forEach(item => {
      const isOwned = owned.includes(item.id);
      const isEquipped = (equipped === item.id);
      const isUnlocked = currentStreak >= item.reqStreak;

      const card = document.createElement('div');
      card.className = `wardrobe-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      let actionHtml = '';
      if (!isUnlocked) {
        actionHtml = `<button class="btn-locked" disabled>🔒 Со стрика ${item.reqStreak} дн</button>`;
      } else if (isOwned) {
        if (isEquipped) {
          actionHtml = `<button class="btn-unequip" data-id="${item.id}">Снять</button>`;
        } else {
          actionHtml = `<button class="btn-equip" data-id="${item.id}">Надеть</button>`;
        }
      } else {
        actionHtml = `
          <div class="item-actions">
            <button class="btn-try" data-id="${item.id}">Примерить</button>
            <button class="btn-buy" data-id="${item.id}" ${coins < item.price ? 'disabled style="opacity:0.6;"' : ''}>
              ${item.price} ❤️
            </button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="item-ico">${item.ico}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-req">${item.reqStreak === 0 ? 'Базовый наряд' : `Стрик ${item.reqStreak}+ дней`}</div>
        ${actionHtml}
      `;

      // Примерка
      card.querySelector('.btn-try')?.addEventListener('click', () => {
        previewItem = item.id;
        applyAccessoryToSvg(item.id);
        if (tryonBanner && tryonName) {
          tryonBanner.style.display = 'flex';
          tryonName.innerText = item.name;
        }
        if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
      });

      // Покупка
      card.querySelector('.btn-buy')?.addEventListener('click', () => {
        const curCoins = getHeartCoins();
        if (curCoins >= item.price) {
          setHeartCoins(curCoins - item.price);
          addOwnedItem(item.id);
          setEquippedItem(item.id);
          previewItem = null;
          if (tryonBanner) tryonBanner.style.display = 'none';
          if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
          renderGrid();
        } else {
          alert('Не хватает сердечек! Сыграйте в «Ловец сердец» 🎯');
        }
      });

      // Надеть
      card.querySelector('.btn-equip')?.addEventListener('click', () => {
        setEquippedItem(item.id);
        previewItem = null;
        if (tryonBanner) tryonBanner.style.display = 'none';
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        renderGrid();
      });

      // Снять
      card.querySelector('.btn-unequip')?.addEventListener('click', () => {
        setEquippedItem(null);
        if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        renderGrid();
      });

      grid.appendChild(card);
    });
  }
}

// ==========================================
// 5. МИНИ-ИГРА: ЛОВЕЦ СЕРДЕЦ (АРКАДА)
// ==========================================
function setupArcadeGame() {
  const arena = document.getElementById('arcade-arena');
  const overlay = document.getElementById('arena-overlay');
  const hud = document.getElementById('arena-hud');
  const timerEl = document.getElementById('game-timer');
  const scoreEl = document.getElementById('game-current-score');
  const attemptsEl = document.getElementById('attempts-display');
  const playBtn = document.getElementById('btn-start-arcade');
  const overlayTitle = document.getElementById('overlay-title');
  const overlaySub = document.getElementById('overlay-sub');

  const myBestEl = document.getElementById('arcade-my-best');
  const partnerBestEl = document.getElementById('arcade-partner-best');
  const myNameLabel = document.getElementById('arcade-my-name');
  const partnerNameLabel = document.getElementById('arcade-partner-name');

  if (myNameLabel) myNameLabel.innerText = `${myName} (Ты)`;
  if (partnerNameLabel) partnerNameLabel.innerText = partnerName;

  let myScore = Number(urlParams.get(isUser1 ? 'u1_score' : 'u2_score') || localStorage.getItem('my_arcade_record') || 0);
  let partnerScore = Number(urlParams.get(isUser1 ? 'u2_score' : 'u1_score') || 0);

  if (myBestEl) myBestEl.innerText = myScore;
  if (partnerBestEl) partnerBestEl.innerText = partnerScore;

  const todayKey = `arcade_attempts_${new Date().toISOString().slice(0, 10)}`;
  let attemptsLeft = Number(localStorage.getItem(todayKey) ?? 3);

  function updateAttemptsUI() {
    const hearts = ['🖤🖤🖤', '❤️🖤🖤', '❤️❤️🖤', '❤️❤️❤️'];
    if (attemptsEl) attemptsEl.innerText = hearts[attemptsLeft] || '🖤🖤🖤';
    if (attemptsLeft <= 0) {
      if (playBtn) {
        playBtn.disabled = true;
        playBtn.querySelector('span').innerText = 'Попытки закончились 🌙';
      }
    } else {
      if (playBtn) {
        playBtn.disabled = false;
        playBtn.querySelector('span').innerText = `Играть (${attemptsLeft}/3) ▶️`;
      }
    }
  }

  updateAttemptsUI();

  let gameInterval = null;
  let spawnInterval = null;
  let timeLeft = 15;
  let currentScore = 0;
  let isPlaying = false;

  playBtn?.addEventListener('click', () => {
    if (attemptsLeft <= 0 || isPlaying) return;

    attemptsLeft--;
    localStorage.setItem(todayKey, attemptsLeft);
    updateAttemptsUI();

    startGame();
  });

  function startGame() {
    isPlaying = true;
    timeLeft = 15;
    currentScore = 0;

    overlay.style.display = 'none';
    hud.style.display = 'flex';
    timerEl.innerText = timeLeft;
    scoreEl.innerText = currentScore;

    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

    gameInterval = setInterval(() => {
      timeLeft--;
      timerEl.innerText = timeLeft;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    spawnInterval = setInterval(spawnHeart, 480);
  }

  function spawnHeart() {
    if (!isPlaying) return;

    const heart = document.createElement('div');
    heart.className = 'spawned-heart';

    const roll = Math.random();
    let pts = 1;
    let emoji = '❤️';

    if (roll > 0.85) {
      pts = 3;
      emoji = '💛';
    } else if (roll < 0.15) {
      pts = -2;
      emoji = '💔';
    }

    heart.innerText = emoji;

    const arenaW = arena.clientWidth - 50;
    const arenaH = arena.clientHeight - 60;
    const x = Math.max(10, Math.floor(Math.random() * arenaW));
    const y = Math.max(40, Math.floor(Math.random() * arenaH));

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    heart.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      currentScore += pts;
      scoreEl.innerText = currentScore;

      showSplash(e.clientX, e.clientY, pts > 0 ? `+${pts}` : `${pts}`, pts > 0 ? '#55EFC4' : '#FF7675');

      if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(pts > 0 ? 'light' : 'heavy');
      }

      heart.remove();
    });

    arena.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) heart.remove();
    }, 1400);
  }

  function showSplash(x, y, text, color) {
    const splash = document.createElement('div');
    splash.className = 'heart-splash';
    splash.innerText = text;
    splash.style.color = color;
    splash.style.left = `${x - 10}px`;
    splash.style.top = `${y - 20}px`;
    document.body.appendChild(splash);
    setTimeout(() => splash.remove(), 600);
  }

  function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    document.querySelectorAll('.spawned-heart').forEach(h => h.remove());

    hud.style.display = 'none';
    overlay.style.display = 'flex';

    // Зачисляем заработанные очки в банк сердечек!
    if (currentScore > 0) {
      setHeartCoins(getHeartCoins() + currentScore);
    }

    overlayTitle.innerText = `Время вышло! Счёт: ${currentScore} 🎉`;

    if (currentScore > myScore) {
      myScore = currentScore;
      myBestEl.innerText = myScore;
      localStorage.setItem('my_arcade_record', myScore);
      overlaySub.innerHTML = `🔥 Новый рекорд! <b>+${Math.max(0, currentScore)} ❤️</b> зачислено в гардероб!`;
      syncRecordWithPartner(myScore);
    } else {
      overlaySub.innerHTML = `Твой рекорд: ${myScore} | <b>+${Math.max(0, currentScore)} ❤️</b> зачислено в гардероб!`;
    }

    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  }

  function syncRecordWithPartner(record) {
    const newU1Score = isUser1 ? record : partnerScore;
    const newU2Score = isUser1 ? partnerScore : record;

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('u1_score', newU1Score);
    nextUrl.searchParams.set('u2_score', newU2Score);
    const finalUrl = nextUrl.toString();

    window.history.replaceState({}, '', finalUrl);

    if (paramBotToken) {
      [paramU1Id, paramU2Id].forEach(uid => {
        if (!uid) return;
        fetch(`https://api.telegram.org/bot${paramBotToken}/setChatMenuButton`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: uid,
            menu_button: {
              type: 'web_app',
              text: 'Наш мир ❤️',
              web_app: { url: finalUrl }
            }
          })
        }).catch(e => console.error(e));
      });

      if (partnerId) {
        fetch(`https://api.telegram.org/bot${paramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: partnerId,
            text: `🏆 <b>${myName} установил(а) новый рекорд в «Ловце сердец»: ${record} очков!</b>\n\nСможешь обогнать? У тебя есть 3 попытки на сегодня! 😼`,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [[{ text: '🎮 Принять вызов!', web_app: { url: finalUrl } }]]
            }
          })
        }).catch(e => console.error(e));
      }
    }
  }
}

// 6. РАЗДЕЛ: ВОПРОС ДНЯ
function setupGamesSection() {
  const qTitle = document.getElementById('daily-q-text');
  if (qTitle) qTitle.innerText = paramQText;

  const myNameEl = document.getElementById('my-card-name');
  const partnerNameEl = document.getElementById('partner-card-name');
  if (myNameEl) myNameEl.innerText = `${myName} (Ты)`;
  if (partnerNameEl) partnerNameEl.innerText = `Ответ: ${partnerName}`;

  let currentMyAns = isUser1 ? (urlParams.get('u1_ans') || '') : (urlParams.get('u2_ans') || '');
  let currentPartnerAns = isUser1 ? (urlParams.get('u2_ans') || '') : (urlParams.get('u1_ans') || '');

  const inputMode = document.getElementById('my-input-mode');
  const viewMode = document.getElementById('my-view-mode');
  const displayText = document.getElementById('my-display-text');
  const myStatusDot = document.getElementById('my-card-status');
  const inputField = document.getElementById('game-answer-input');

  const partnerTextEl = document.getElementById('partner-display-text');
  const partnerStatus = document.getElementById('partner-card-status');

  function renderPartnerCard(ans) {
    if (ans) {
      if (partnerTextEl) partnerTextEl.innerText = `«${ans}»`;
      if (partnerStatus) partnerStatus.innerText = '✓';
    } else {
      if (partnerTextEl) partnerTextEl.innerText = `${partnerName} еще пишет ответ... ⏳`;
      if (partnerStatus) partnerStatus.innerText = '⏳';
    }
  }

  function showMyAnswer(text) {
    if (inputMode) inputMode.style.display = 'none';
    if (viewMode) viewMode.style.display = 'flex';
    if (displayText) displayText.innerText = `«${text}»`;
    if (myStatusDot) myStatusDot.innerText = '✓';
  }

  function showInputMode(defaultText = '') {
    if (viewMode) viewMode.style.display = 'none';
    if (inputMode) inputMode.style.display = 'flex';
    if (inputField) {
      inputField.value = defaultText;
      inputField.focus();
    }
    if (myStatusDot) myStatusDot.innerText = '✍️';
  }

  if (currentMyAns) {
    showMyAnswer(currentMyAns);
  } else {
    showInputMode();
  }
  renderPartnerCard(currentPartnerAns);

  document.getElementById('btn-submit-answer')?.addEventListener('click', async () => {
    const text = inputField?.value.trim();
    if (!text) {
      alert('Напиши хотя бы пару слов! 💖');
      return;
    }

    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');

    showMyAnswer(text);
    currentMyAns = text;

    const newU1 = isUser1 ? text : (urlParams.get('u1_ans') || '');
    const newU2 = isUser1 ? (urlParams.get('u2_ans') || '') : text;

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('u1_ans', newU1);
    nextUrl.searchParams.set('u2_ans', newU2);
    const finalUrlString = nextUrl.toString();

    window.history.replaceState({}, '', finalUrlString);
    urlParams.set('u1_ans', newU1);
    urlParams.set('u2_ans', newU2);

    if (paramBotToken) {
      const updateMenu = (uid) => {
        if (!uid) return;
        fetch(`https://api.telegram.org/bot${paramBotToken}/setChatMenuButton`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: uid,
            menu_button: {
              type: 'web_app',
              text: 'Наш мир ❤️',
              web_app: { url: finalUrlString }
            }
          })
        }).catch(e => console.error(e));
      };

      updateMenu(paramU1Id);
      updateMenu(paramU2Id);

      if (partnerId) {
        const safeText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeMyName = myName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        fetch(`https://api.telegram.org/bot${paramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: partnerId,
            text: `🎲 <b>Твоя половинка (${safeMyName}) ответила на вопрос дня:</b>\n\n«${safeText}»\n\nНажми кнопку ниже, чтобы открыть ответ в приложении! ❤️`,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [[{ text: '🎲 Открыть вопрос дня', web_app: { url: finalUrlString } }]]
            }
          })
        }).catch(e => console.error(e));
      }
    }
  });

  document.getElementById('btn-edit-answer')?.addEventListener('click', () => {
    showInputMode(currentMyAns);
  });
}

// 7. Подгрузка аватарок
function loadAvatars() {
  function setAvatar(imgId, fallbackId, username) {
    const imgEl = document.getElementById(imgId);
    const fallbackEl = document.getElementById(fallbackId);
    let photoUrl = null;

    if (currentTgUser && currentTgUser.username && currentTgUser.username.toLowerCase() === username.toLowerCase()) {
      photoUrl = currentTgUser.photo_url;
    }
    if (!photoUrl && username) {
      photoUrl = `https://t.me/i/userpic/320/${username}.jpg`;
    }

    if (photoUrl && imgEl) {
      imgEl.src = photoUrl;
      imgEl.onload = () => {
        imgEl.style.display = 'block';
        if (fallbackEl) fallbackEl.style.display = 'none';
      };
      imgEl.onerror = () => {
        imgEl.style.display = 'none';
        if (fallbackEl) fallbackEl.style.display = 'block';
      };
    }
  }

  const fb1 = document.getElementById('avatar-fallback-u1');
  const fb2 = document.getElementById('avatar-fallback-u2');
  if (fb1) fb1.innerText = paramU1Name.charAt(0).toUpperCase();
  if (fb2) fb2.innerText = paramU2Name.charAt(0).toUpperCase();

  setAvatar('avatar-img-u1', 'avatar-fallback-u1', paramU1User);
  setAvatar('avatar-img-u2', 'avatar-fallback-u2', paramU2User);
}

// 8. Отрисовка альбома
function renderAlbum() {
  const grid = document.getElementById('photo-grid');
  const emptyBlock = document.getElementById('empty-album');
  const counterEl = document.getElementById('album-total-count');

  if (!paramPhotos) {
    if (grid) grid.style.display = 'none';
    if (emptyBlock) emptyBlock.style.display = 'block';
    if (counterEl) counterEl.innerText = '0 кадров';
    return;
  }

  const items = paramPhotos.split('~');
  if (counterEl) counterEl.innerText = `${items.length} ${getRussianPlural(items.length, ['кадр', 'кадра', 'кадров'])}`;

  if (emptyBlock) emptyBlock.style.display = 'none';
  if (grid) {
    grid.style.display = 'grid';
    grid.innerHTML = '';

    items.forEach(rawItem => {
      const [filePath, dateStr, authorName] = rawItem.split('*');
      if (!filePath) return;

      const fullPhotoUrl = `https://api.telegram.org/file/bot${paramBotToken}/${filePath}`;

      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.innerHTML = `
        <img class="polaroid-thumb" src="${fullPhotoUrl}" alt="Момент" loading="lazy">
        <div class="polaroid-meta">
          <span class="polaroid-author">${authorName}</span>
          <span class="polaroid-date">${dateStr}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        openModal(fullPhotoUrl, `${authorName} • ${dateStr}`);
      });

      grid.appendChild(card);
    });
  }
}

const modal = document.getElementById('photo-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');

function openModal(src, caption) {
  if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  modalImg.src = src;
  modalCaption.innerText = caption;
  modal.classList.add('open');
  modal.style.setProperty('display', 'flex', 'important');
}

function closeModal() {
  modal.classList.remove('open');
  modal.style.setProperty('display', 'none', 'important');
  modalImg.src = '';
}

document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
document.getElementById('modal-close-bg')?.addEventListener('click', closeModal);

// 9. Статусы монстрика и дни отношений
function updateStatuses() {
  const badge1 = document.getElementById('status-badge-u1');
  const badge2 = document.getElementById('status-badge-u2');

  if (badge1) {
    badge1.className = `moment-status ${paramU1Sent ? 'done' : 'waiting'}`;
    badge1.innerText = paramU1Sent ? '✓' : '⏳';
  }
  if (badge2) {
    badge2.className = `moment-status ${paramU2Sent ? 'done' : 'waiting'}`;
    badge2.innerText = paramU2Sent ? '✓' : '⏳';
  }

  const checkRow = document.getElementById('photo-check-row');
  if (checkRow) {
    checkRow.innerHTML = `
      <div class="user-check ${paramU1Sent ? 'done' : 'pending'}">
        <span class="check-icon">${paramU1Sent ? '✓' : '⏳'}</span> ${paramU1Name} ${paramU1Sent ? 'отправил(а)' : 'еще нет'}
      </div>
      <div class="user-check ${paramU2Sent ? 'done' : 'pending'}">
        <span class="check-icon">${paramU2Sent ? '✓' : '⏳'}</span> ${paramU2Name} ${paramU2Sent ? 'отправил(а)' : 'еще нет'}
      </div>
    `;
  }

  const monster = document.getElementById('monster-character');
  const speech = document.getElementById('pet-speech')?.querySelector('span');
  const energyVal = document.getElementById('energy-val');
  const energyProgress = document.getElementById('energy-progress');

  const sentCount = (paramU1Sent ? 1 : 0) + (paramU2Sent ? 1 : 0);

  if (sentCount === 2) {
    if (monster) monster.className = 'monster-wrapper happy';
    if (speech) speech.innerText = 'Оба момента на базе! Монстрик полон сил ✨';
    if (energyVal) energyVal.innerText = '100%';
    if (energyProgress) {
      energyProgress.style.width = '100%';
      energyProgress.style.background = 'linear-gradient(90deg, #00B894, #55EFC4)';
    }
  } else if (sentCount === 1) {
    if (monster) monster.className = 'monster-wrapper happy';
    if (speech) speech.innerText = 'Один момент готов! Ждем вторую половинку 🥣';
    if (energyVal) energyVal.innerText = '50%';
    if (energyProgress) {
      energyProgress.style.width = '50%';
      energyProgress.style.background = 'linear-gradient(90deg, #6C5CE7, #FF5E8A)';
    }
  } else {
    if (monster) monster.className = 'monster-wrapper leaving';
    if (speech) speech.innerText = 'Вы забыли про фото... Монстрик скучает 😢';
    if (energyVal) energyVal.innerText = '0%';
    if (energyProgress) {
      energyProgress.style.width = '10%';
      energyProgress.style.background = 'linear-gradient(90deg, #D63031, #E55039)';
    }
  }
}

function setupDaysCounter() {
  const anniversaryEl = document.getElementById('anniversary-date');
  let startDate;

  if (paramStartDate && paramStartDate.includes('-')) {
    const parts = paramStartDate.split('-');
    startDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    if (anniversaryEl) {
      anniversaryEl.innerText = `с ${startDate.getDate()} ${months[startDate.getMonth()]} ${startDate.getFullYear()}`;
    }
  } else {
    startDate = new Date();
    if (anniversaryEl) anniversaryEl.innerText = 'Установите через /date';
  }

  const now = new Date();
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const counterEl = document.getElementById('days-counter');
  const labelEl = document.getElementById('days-label');
  if (counterEl && labelEl) {
    counterEl.innerText = diffDays;
    labelEl.innerText = getRussianPlural(diffDays, ['день вместе', 'дня вместе', 'дней вместе']);
  }
}

function getRussianPlural(number, titles) {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}

// 10. Кнопка камеры
document.getElementById('dock-snap-btn')?.addEventListener('click', () => {
  if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  const heart = document.createElement('div');
  heart.innerHTML = '💖';
  heart.style.position = 'fixed';
  heart.style.bottom = '95px';
  heart.style.left = '50%';
  heart.style.transform = 'translateX(-50%)';
  heart.style.fontSize = '34px';
  heart.style.zIndex = '999';
  heart.style.pointerEvents = 'none';
  heart.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = 'translate(-50%, -120px) scale(1.6)';
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
    if (tg) tg.close();
  }, 400);
});

// Запуск
loadAvatars();
updateStatuses();
setupDaysCounter();
renderAlbum();
setupGamesSection();
setupArcadeGame();
setupWardrobeUI();