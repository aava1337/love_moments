// 1. Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#181124');
  tg.setBackgroundColor('#0D0914');
}

// 2. Элементы интерфейса
const tabHome = document.getElementById('tab-home');
const tabAlbum = document.getElementById('tab-album');
const screenHome = document.getElementById('screen-home');
const screenAlbum = document.getElementById('screen-album');

// Функция жесткого переключения экранов
function showTab(tabName) {
  if (tabName === 'home') {
    tabHome?.classList.add('active');
    tabAlbum?.classList.remove('active');
    if (screenHome) {
      screenHome.classList.add('active');
      screenHome.style.setProperty('display', 'flex', 'important');
    }
    if (screenAlbum) {
      screenAlbum.classList.remove('active');
      screenAlbum.style.setProperty('display', 'none', 'important');
    }
  } else if (tabName === 'album') {
    tabAlbum?.classList.add('active');
    tabHome?.classList.remove('active');
    if (screenAlbum) {
      screenAlbum.classList.add('active');
      screenAlbum.style.setProperty('display', 'flex', 'important');
    }
    if (screenHome) {
      screenHome.classList.remove('active');
      screenHome.style.setProperty('display', 'none', 'important');
    }
  }
}

// ПРИНУДИТЕЛЬНЫЙ СБРОС НА ДОМ ПРИ ЗАГРУЗКЕ
showTab('home');

// Обработчики кликов по меню
tabHome?.addEventListener('click', () => {
  showTab('home');
  if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
});

tabAlbum?.addEventListener('click', () => {
  showTab('album');
  if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged();
});

['tab-games', 'tab-vip'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', (e) => {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    const txt = e.currentTarget.querySelector('.dock-txt').innerText;
    alert(`Раздел "${txt}" появится в следующем обновлении! 💖`);
  });
});

// 3. Получение параметров из URL
const urlParams = new URLSearchParams(window.location.search);

const paramStartDate = urlParams.get('start_date');
const paramStreak = urlParams.get('streak') || '1';
const paramU1Name = urlParams.get('u1_name') || 'Партнер 1';
const paramU2Name = urlParams.get('u2_name') || 'Партнер 2';
const paramU1User = urlParams.get('u1_user') || '';
const paramU2User = urlParams.get('u2_user') || '';
const paramU1Sent = urlParams.get('u1_sent') === '1';
const paramU2Sent = urlParams.get('u2_sent') === '1';
const paramPhotos = urlParams.get('photos') || '';
const paramBotToken = urlParams.get('bot_token') || '';

const streakEl = document.getElementById('streak-count');
if (streakEl) streakEl.innerText = paramStreak;

// 4. Подгрузка аватарок
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

// 5. Отрисовка альбома
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

// 6. Полноэкранный просмотр
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

// 7. Статусы монстрика и счетчик дней
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

// Запуск остальных процессов
loadAvatars();
updateStatuses();
setupDaysCounter();
renderAlbum();