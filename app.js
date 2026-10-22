// 1. Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#181124');
  tg.setBackgroundColor('#0D0914');
}

// 2. Считываем реальные параметры пары из URL
const urlParams = new URLSearchParams(window.location.search);

const paramStartDate = urlParams.get('start_date'); // "2023-11-29"
const paramStreak = urlParams.get('streak') || '1';
const paramU1Name = urlParams.get('u1_name') || 'Он';
const paramU2Name = urlParams.get('u2_name') || 'Она';
const paramU1Sent = urlParams.get('u1_sent') === '1';
const paramU2Sent = urlParams.get('u2_sent') === '1';

// Устанавливаем стрик
const streakCountEl = document.getElementById('streak-count');
if (streakCountEl) streakCountEl.innerText = paramStreak;

// Устанавливаем имена и первые буквы аватаров
const ringMale = document.querySelector('.avatar-ring.male span');
const ringFemale = document.querySelector('.avatar-ring.female span');
if (ringMale) ringMale.innerText = paramU1Name.charAt(0).toUpperCase();
if (ringFemale) ringFemale.innerText = paramU2Name.charAt(0).toUpperCase();

// Обновляем текст чеклиста под полоской
const checkRow = document.querySelector('.photo-check-row');
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

// 3. Расчет реальных дней вместе
function setupDaysCounter() {
  let startDate;
  const anniversaryEl = document.querySelector('.anniversary-date');

  if (paramStartDate && paramStartDate.includes('-')) {
    const parts = paramStartDate.split('-');
    startDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    
    // Красивая подпись даты
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    if (anniversaryEl) {
      anniversaryEl.innerText = `с ${startDate.getDate()} ${months[startDate.getMonth()]} ${startDate.getFullYear()}`;
    }
  } else {
    // Если дата еще не установлена в боте
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

// 4. Реальное состояние сытости монстрика
function applyRealPetState() {
  const monster = document.getElementById('monster-character');
  const speech = document.getElementById('pet-speech')?.querySelector('span');
  const energyVal = document.getElementById('energy-val');
  const energyProgress = document.getElementById('energy-progress');

  const sentCount = (paramU1Sent ? 1 : 0) + (paramU2Sent ? 1 : 0);

  if (sentCount === 2) {
    // Оба отправили
    if (monster) monster.className = 'monster-wrapper happy';
    if (speech) speech.innerText = 'Ура! Оба момента на базе. Я сыт на 100% ✨';
    if (energyVal) energyVal.innerText = '100%';
    if (energyProgress) {
      energyProgress.style.width = '100%';
      energyProgress.style.background = 'linear-gradient(90deg, #00B894, #55EFC4)';
    }
  } else if (sentCount === 1) {
    // Отправил только один
    if (monster) monster.className = 'monster-wrapper happy';
    if (speech) speech.innerText = 'Один момент готов! Ждем вторую половинку 🥣';
    if (energyVal) energyVal.innerText = '50%';
    if (energyProgress) {
      energyProgress.style.width = '50%';
      energyProgress.style.background = 'linear-gradient(90deg, #6C5CE7, #FF5E8A)';
    }
  } else {
    // Никто не отправил
    if (monster) monster.className = 'monster-wrapper leaving';
    if (speech) speech.innerText = 'Монстрик голоден и ждет ваших фото дня... 😢';
    if (energyVal) energyVal.innerText = '0%';
    if (energyProgress) {
      energyProgress.style.width = '10%';
      energyProgress.style.background = 'linear-gradient(90deg, #D63031, #E55039)';
    }
  }
}

// 5. Обработка клика по камере
document.getElementById('dock-snap-btn').addEventListener('click', () => {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred('success');
  }

  createFloatingHeart();

  setTimeout(() => {
    if (tg) {
      tg.close();
    } else {
      alert('Отправьте фото прямо в чат с ботом!');
    }
  }, 400);
});

// Анимация сердечка
function createFloatingHeart() {
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

  setTimeout(() => heart.remove(), 800);
}

// Запуск
setupDaysCounter();
applyRealPetState();