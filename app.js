// 1. Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#181124');
  tg.setBackgroundColor('#0D0914');
}

// 2. Расчет дней отношений (29 ноября 2023)
const startDate = new Date(2023, 10, 29);

function calculateDays() {
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

// 3. Обработка клика по центральной круглой кнопке камеры
document.getElementById('dock-snap-btn').addEventListener('click', () => {
  if (tg?.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred('success');
  }

  createFloatingHeart();

  setTimeout(() => {
    if (tg) {
      // Закрываем WebApp и возвращаем пользователя в диалог с ботом для отправки фото
      tg.close();
    } else {
      alert('Открываем камеру диалога бота для отправки фото...');
    }
  }, 400);
});

// 4. Переключение вкладок в нижнем баре
const dockItems = document.querySelectorAll('.dock-item');
dockItems.forEach(item => {
  item.addEventListener('click', () => {
    dockItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }

    const tabName = item.querySelector('.dock-txt').innerText;
    if (tabName !== 'Дом') {
      alert(`Раздел "${tabName}" скоро станет доступен! 💖`);
    }
  });
});

// Анимация взлетающего сердечка при нажатии на камеру
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

calculateDays();