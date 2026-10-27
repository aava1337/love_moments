// 1. Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#181124');
  tg.setBackgroundColor('#0D0914');
}

// 2. Элементы навигации
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

// 3. Параметры из URL
const urlParams = new URLSearchParams(window.location.search);

const paramStartDate = urlParams.get('start_date');
const paramStreak = urlParams.get('streak') || '1';
const paramU1Id = parseInt(urlParams.get('u1_id') || '0');
const paramU2Id = parseInt(urlParams.get('u2_id') || '0');
const paramU1Name = urlParams.get('u1_name') || 'Партнер 1';
const paramU2Name = urlParams.get('u2_name') || 'Партнер 2';
const paramU1User = urlParams.get('u1_user') || '';
const paramU2User = urlParams.get('u2_user') || '';
const paramU1Sent = urlParams.get('u1_sent') === '1';
const paramU2Sent = urlParams.get('u2_sent') === '1';
const paramPhotos = urlParams.get('photos') || '';
const paramBotToken = urlParams.get('bot_token') || '';
const paramQText = urlParams.get('q_text') || 'Какое наше совместное воспоминание самое теплое? ✨';
const paramU1Ans = urlParams.get('u1_ans') || '';
const paramU2Ans = urlParams.get('u2_ans') || '';

const streakEl = document.getElementById('streak-count');
if (streakEl) streakEl.innerText = paramStreak;

// 4. Логика игры (Ввод прямо в приложении)
function setupGamesSection() {
  const qTitle = document.getElementById('daily-q-text');
  if (qTitle) qTitle.innerText = paramQText;

  const currentTgId = tg?.initDataUnsafe?.user?.id;
  const isUser1 = (!currentTgId || currentTgId === paramU1Id);

  const myName = isUser1 ? paramU1Name : paramU2Name;
  const partnerName = isUser1 ? paramU2Name : paramU1Name;
  const partnerId = isUser1 ? paramU2Id : paramU1Id;

  // Имена в заголовках карточек
  const myNameEl = document.getElementById('my-card-name');
  const partnerNameEl = document.getElementById('partner-card-name');
  if (myNameEl) myNameEl.innerText = `${myName} (Ты)`;
  if (partnerNameEl) partnerNameEl.innerText = partnerName;

  // Локальное кэширование ответа
  const localAnswerKey = `game_ans_${new Date().toISOString().slice(0, 10)}`;
  const savedMyAns = localStorage.getItem(localAnswerKey) || (isUser1 ? paramU1Ans : paramU2Ans);
  const partnerAns = isUser1 ? paramU2Ans : paramU1Ans;

  const inputMode = document.getElementById('my-input-mode');
  const viewMode = document.getElementById('my-view-mode');
  const displayText = document.getElementById('my-display-text');
  const myStatusDot = document.getElementById('my-card-status');
  const inputField = document.getElementById('game-answer-input');

  // Показ моего ответа
  function showMyAnswer(text) {
    if (inputMode) inputMode.style.display = 'none';
    if (viewMode) viewMode.style.display = 'flex';
    if (displayText) displayText.innerText = `«${text}»`;
    if (myStatusDot) myStatusDot.innerText = '✓';
  }

  // Режим редактирования
  function showInputMode(defaultText = '') {
    if (viewMode) viewMode.style.display = 'none';
    if (inputMode) inputMode.style.display = 'flex';
    if (inputField) {
      inputField.value = defaultText;
      inputField.focus();
    }
    if (myStatusDot) myStatusDot.innerText = '✍️';
  }

  if (savedMyAns) {
    showMyAnswer(savedMyAns);
  } else {
    showInputMode();
  }

  // Карточка партнера
  const partnerTextEl = document.getElementById('partner-display-text');
  const partnerStatus = document.getElementById('partner-card-status');
  if (partnerAns) {
    if (partnerTextEl) partnerTextEl.innerText = `«${partnerAns}»`;
    if (partnerStatus) partnerStatus.innerText = '✓';
  } else {
    if (partnerTextEl) partnerTextEl.innerText = `${partnerName} еще пишет ответ... ⏳`;
    if (partnerStatus) partnerStatus.innerText = '⏳';
  }

  // Обработка кнопки «Отправить ответ»
  document.getElementById('btn-submit-answer')?.addEventListener('click', async () => {
    const text = inputField?.value.trim();
    if (!text) {
      alert('Пожалуйста, напиши хотя бы пару слов! 💖');
      return;
    }

    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');

    // 1. Моментально отображаем ответ на экране
    localStorage.setItem(localAnswerKey, text);
    showMyAnswer(text);

    // 2. Отправляем уведомление партнеру в Telegram через Bot API
    if (paramBotToken && partnerId) {
      try {
        await fetch(`https://api.telegram.org/bot${paramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: partnerId,
            text: `🎲 **Твоя половинка (${myName}) ответила на вопрос дня:**\n\n«${text}»\n\nЗайди в приложение во вкладку «Игры», чтобы прочитать и ответить! ❤️`,
            parse_mode: 'Markdown'
          })
        });
      } catch (e) {
        console.error('Ошибка отправки партнеру:', e);
      }
    }
  });

  // Кнопка «Изменить»
  document.getElementById('btn-edit-answer')?.addEventListener('click', () => {
    const cur = displayText?.innerText.replace(/^[«"]|[»"]$/g, '') || '';
    showInputMode(cur);
  });
}

// 5. Подгрузка аватарок
function loadAvatars() {
  const currentTgUser = tg?.initDataUnsafe?.user;

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

// 6. Отрисовка альбома
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

// 7. Статусы монстрика
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

// 8. Кнопка камеры
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