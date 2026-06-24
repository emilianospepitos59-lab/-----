/* ============================================================
   НЕ-ДУЖЕ-СЕКРЕТНО — Скрипт
   ============================================================ */

'use strict';

var siteLanguage = localStorage.getItem('nds-language') === 'en' ? 'en' : 'uk';

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let cx = -100, cy = -100;
  let raf;

  function moveCursor(e) {
    cx = e.clientX;
    cy = e.clientY;
    if (!raf) {
      raf = requestAnimationFrame(() => {
        cursor.style.left = cx + 'px';
        cursor.style.top  = cy + 'px';
        raf = null;
      });
    }
  }

  document.addEventListener('mousemove', moveCursor);
  document.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
})();


/* ─────────────────────────────────────────────
   REAL-TIME CLOCK
───────────────────────────────────────────── */
(function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;

  function tick() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    el.textContent = h + ':' + m + ':' + s;
  }
  tick();
  setInterval(tick, 1000);
})();


/* ─────────────────────────────────────────────
   HERO DATE STAMP
───────────────────────────────────────────── */
(function initHeroDate() {
  const el = document.getElementById('heroDate');
  if (!el) return;
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  el.textContent = y + '.' + m + '.' + day;
})();


/* ─────────────────────────────────────────────
   TYPEWRITER HELPER
───────────────────────────────────────────── */
function typeIn(el, text, speed, delay) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      var i = 0;
      var iv = setInterval(function() {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(iv);
          resolve();
        }
      }, speed);
    }, delay || 0);
  });
}

function pause(ms) {
  return new Promise(function(r) { setTimeout(r, ms); });
}


/* ─────────────────────────────────────────────
   HERO TYPE SEQUENCE
───────────────────────────────────────────── */
(function initHeroType() {
  var subtitleEl    = document.getElementById('heroSubtitle');
  var terminalEl    = document.getElementById('terminalText');
  if (!subtitleEl || !terminalEl) return;

  var subtitleText = siteLanguage === 'en'
    ? 'A personal archive of strange ideas and accidental projects'
    : 'Особистий архів дивних ідей та випадкових проєктів';
  var terminalSteps = siteLanguage === 'en' ? [
    'initializing system...',
    'loading files...',
    'verifying access...',
    'access granted.',
  ] : [
    'ініціалізація системи...',
    'завантаження файлів...',
    'перевірка доступу...',
    'доступ дозволено.',
  ];

  async function run() {
    await typeIn(subtitleEl, subtitleText, 32, 400);
    await pause(300);

    for (var i = 0; i < terminalSteps.length; i++) {
      await typeIn(terminalEl, terminalSteps[i], 28, 150);
      await pause(550);
      if (i < terminalSteps.length - 1) {
        terminalEl.textContent = '';
      }
    }
  }
  run();
})();


/* ─────────────────────────────────────────────
   NAVIGATION: SCROLL + ACTIVE STATE
───────────────────────────────────────────── */
(function initNav() {
  var nav         = document.getElementById('nav');
  var navToggle   = document.getElementById('navToggle');
  var navLinks    = document.getElementById('navLinks');
  var allNavLinks = document.querySelectorAll('.nav-link');
  if (!nav) return;

  /* Sticky style on scroll */
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    /* Active link tracking */
    var offset = window.scrollY + 110;
    document.querySelectorAll('section[id]').forEach(function(sec) {
      var top    = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      var id     = sec.getAttribute('id');
      var link   = document.querySelector('.nav-link[data-section="' + id + '"]');
      if (!link) return;
      if (offset >= top && offset < bottom) {
        allNavLinks.forEach(function(l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile hamburger */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });

    /* Close drawer when a link is tapped */
    allNavLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();


/* ─────────────────────────────────────────────
   OPEN FILE BUTTON → SMOOTH SCROLL TO ABOUT
───────────────────────────────────────────── */
(function initOpenFile() {
  var btn = document.getElementById('openFileBtn');
  var trophyBtn = document.getElementById('openTrophyBtn');

  if (btn) btn.addEventListener('click', function() {
    var target = document.getElementById('about');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });

  if (trophyBtn) trophyBtn.addEventListener('click', function() {
    var target = document.getElementById('trophies');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
})();


/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER — SCROLL REVEAL
───────────────────────────────────────────── */
(function initReveal() {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  /* Stagger siblings that share a parent */
  var parents = new Set();
  elements.forEach(function(el) {
    if (el.parentElement) parents.add(el.parentElement);
  });

  parents.forEach(function(parent) {
    var kids = parent.querySelectorAll('.reveal');
    kids.forEach(function(kid, i) {
      kid.style.transitionDelay = (i * 75) + 'ms';
    });
  });

  elements.forEach(function(el) { io.observe(el); });
})();


/* ─────────────────────────────────────────────
   CONTACT — SEND SIGNAL
───────────────────────────────────────────── */
(function initContact() {
  var btn      = document.getElementById('sendSignalBtn');
  var feedback = document.getElementById('signalFeedback');
  if (!btn || !feedback) return;

  var steps = siteLanguage === 'en' ? [
    '> SIGNAL SENT...',
    '> CONNECTION ESTABLISHED.',
    '> WAITING FOR A RESPONSE...',
    '> RESPONSE: SOON™',
  ] : [
    '> СИГНАЛ НАДІСЛАНО...',
    '> ЗВ\'ЯЗОК ВСТАНОВЛЕНО.',
    '> ОЧІКУВАННЯ ВІДПОВІДІ...',
    '> ВІДПОВІДЬ: НЕЗАБАРОМ™',
  ];
  var busy = false;

  btn.addEventListener('click', function() {
    if (busy) return;
    busy = true;
    feedback.textContent = '';

    var i = 0;
    function next() {
      if (i >= steps.length) { busy = false; return; }
      feedback.textContent = steps[i];
      i++;
      setTimeout(next, 850);
    }
    next();
  });
})();


/* ─────────────────────────────────────────────
   EASTER EGG — 5 CLICKS ON TITLE
───────────────────────────────────────────── */
(function initEasterEgg() {
  var title   = document.getElementById('heroTitle');
  var modal   = document.getElementById('easterEggModal');
  var closeBtn= document.getElementById('closeModal');
  if (!title || !modal || !closeBtn) return;

  var clicks  = 0;
  var timer   = null;

  function openModal() {
    modal.hidden = false;
    modal.removeAttribute('hidden');

    /* Stagger the log lines */
    var lines = modal.querySelectorAll('.mlog-line');
    lines.forEach(function(line, i) {
      line.classList.remove('visible');
      setTimeout(function() { line.classList.add('visible'); }, 500 + i * 300);
    });
  }

  function closeModal() {
    modal.hidden = true;
  }

  title.addEventListener('click', function() {
    clicks++;

    /* Micro-bounce feedback */
    title.style.transform = 'scale(1.03)';
    setTimeout(function() { title.style.transform = ''; }, 120);

    clearTimeout(timer);
    if (clicks >= 5) {
      clicks = 0;
      openModal();
      return;
    }
    timer = setTimeout(function() { clicks = 0; }, 2800);
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();


/* ─────────────────────────────────────────────
   OCCASIONAL GLITCH ON SECTION TITLES
───────────────────────────────────────────── */
(function initGlitch() {
  var titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;

  function randomInt(min, max) {
    return Math.floor(min + (max - min) * (
      /* avoid Date.now / Math.random — use a simple LCG seeded once */
      (performance.now() % 1000) / 1000
    ));
  }

  function glitch() {
    var idx   = Math.floor((performance.now() % 100) / 100 * titles.length);
    var title = titles[idx] || titles[0];
    var orig  = title.style.cssText;

    title.style.textShadow = '-2px 0 rgba(139,64,64,.55), 2px 0 rgba(74,100,60,.55)';
    title.style.transform  = 'translateX(2px)';

    setTimeout(function() {
      title.style.textShadow = '';
      title.style.transform  = '';
    }, 90);
  }

  function schedule() {
    /* fire in 5–13 s — deterministic-ish from perf.now */
    var delay = 5000 + (performance.now() % 8000);
    setTimeout(function() { glitch(); schedule(); }, delay);
  }
  schedule();
})();


/* ─────────────────────────────────────────────
   LANGUAGE SWITCHER — UKRAINIAN / ENGLISH
───────────────────────────────────────────── */
(function initLanguageSwitcher() {
  var textMap = {
    'СИСТЕМА ОНЛАЙН': 'SYSTEM ONLINE',
    'ГОЛОВНА': 'HOME',
    'БЮСТИ': 'BUSTS',
    'ТРОФЕЇ': 'TROPHIES',
    'ПРО МЕНЕ': 'ABOUT ME',
    'ПРОЄКТИ': 'PROJECTS',
    'ГАЛЕРЕЯ': 'GALLERY',
    'ЖУРНАЛ': 'LOG',
    'КОНТАКТ': 'CONTACT',
    'НЕ ДУЖЕ': 'NOT VERY',
    'СЕКРЕТНО': 'SECRET',
    'РІВЕНЬ ДОСТУПУ: НЕ-ДУЖЕ-СЕКРЕТНО': 'ACCESS LEVEL: NOT-VERY-SECRET',
    'ДАТА:': 'DATE:',
    'СТАТУС: ВІДКРИТО': 'STATUS: OPEN',
    'НЕ-ДУЖЕ-СЕКРЕТНО': 'NOT-VERY-SECRET',
    'ВІДКРИТИ ДОСЬЄ': 'OPEN DOSSIER',
    '// СЕКЦІЯ 02': '// SECTION 02',
    '// СЕКЦІЯ 03': '// SECTION 03',
    '// СЕКЦІЯ 04': '// SECTION 04',
    '// СЕКЦІЯ 05': '// SECTION 05',
    '// СЕКЦІЯ 06': '// SECTION 06',
    '// СЕКЦІЯ 07': '// SECTION 07',
    '// СЕКЦІЯ 08': '// SECTION 08',
    'АРХІВ БЮСТІВ': 'BUST ARCHIVE',
    'В РОЗРОБЦІ': 'IN PROGRESS',
    'ЗОБРАЖЕННЯ АРХІВУ ОЧІКУЄТЬСЯ': 'ARCHIVE IMAGE PENDING',
    'МАГАЗИН ТРОФЕЇВ': 'TROPHY MARKET',
    'Тут можна виставляти трофеї на продаж: кубки, дивні нагороди, пам\'ятні об\'єкти та інші речі з підозрілою історією.': 'Post trophies for sale here: cups, strange awards, memorable objects, and other things with suspicious history.',
    'ВАЖЛИВО:': 'IMPORTANT:',
    'Це демонстраційна зона продажу. Для справжніх оплат потрібно підключити кошик, оплату та безпечний сервер.': 'This is a demo selling area. Real payments need a cart, payment provider, and secure server.',
    'УСЕ': 'ALL',
    'КУБКИ': 'CUPS',
    'МЕДАЛІ': 'MEDALS',
    'СУВЕНІРИ': 'SOUVENIRS',
    'ІНШЕ': 'OTHER',
    'НОВІ НАДХОДЖЕННЯ': 'NEW ARRIVALS',
    'ОБЕРІТЬ ТРОФЕЙ': 'CHOOSE A TROPHY',
    'Перегляньте категорії та відкрийте запит на купівлю.': 'Browse categories and open a purchase request.',
    'НАПИШІТЬ ПРОДАВЦЮ': 'MESSAGE THE SELLER',
    'Кнопка створить лист із назвою трофея, якщо контакт — email.': 'The button creates an email with the trophy name when the contact is an email.',
    'УЗГОДЬТЕ ОПЛАТУ': 'ARRANGE PAYMENT',
    'Реальні платежі краще підключати через безпечний сервіс.': 'Real payments should be connected through a secure service.',
    'ДОСТУП ПРОДАВЦЯ': 'SELLER ACCESS',
    'Спеціальний код продавця': 'Special seller code',
    'УВІЙТИ': 'ENTER',
    'Підказка: код можна змінити в script.js.': 'Hint: the code can be changed in script.js.',
    'Назва трофея': 'Trophy name',
    'Ціна': 'Price',
    'Стара ціна': 'Old price',
    'Статус': 'Status',
    'Категорія': 'Category',
    'Стан': 'Condition',
    'Контакт': 'Contact',
    'ДОСТУПНО': 'AVAILABLE',
    'ЗАРЕЗЕРВОВАНО': 'RESERVED',
    'ПРОДАНО': 'SOLD',
    'Опис': 'Description',
    'ОПУБЛІКУВАТИ': 'PUBLISH',
    'ОЧИСТИТИ МОЇ ПОСТИ': 'CLEAR MY POSTS',
    'ПЕРЕВІРЕНО': 'VERIFIED',
    'ЗАСЕКРЕЧЕНО': 'CLASSIFIED',
    'ІМ\'Я:': 'NAME:',
    '[ВИЛУЧЕНО]': '[REDACTED]',
    'СТАТУС:': 'STATUS:',
    'АКТИВНИЙ': 'ACTIVE',
    'СПЕЦІАЛІЗАЦІЯ:': 'SPECIALIZATION:',
    'ДИВНІ ПРОЄКТИ': 'STRANGE PROJECTS',
    'РІВЕНЬ НЕБЕЗПЕКИ:': 'DANGER LEVEL:',
    'НИЗЬКИЙ (ЗДЕБІЛЬШОГО)': 'LOW (MOSTLY)',
    'МІСЦЕЗНАХОДЖЕННЯ:': 'LOCATION:',
    '[ВІДСТЕЖУЄТЬСЯ]': '[TRACKED]',
    'Тут повинна бути серйозна інформація про мене, але поки що її немає.': 'There should be serious information about me here, but there is none yet.',
    'Натомість можу повідомити, що я існую, маю кілька проєктів і іноді виходжу на зв\'язок. Решта інформації наразі перебуває на стадії «придумати щось розумне написати».': 'Instead, I can report that I exist, have a few projects, and occasionally make contact. The rest is still at the “think of something smart to write” stage.',
    'Дані оновлюються. Можливо.': 'Data is being updated. Possibly.',
    'ВІДЕО': 'VIDEO',
    'Відеоматеріали різного ступеня серйозності. Можливо, є щось цікаве серед записів.': 'Video material of various degrees of seriousness. There may be something interesting among the recordings.',
    'МЕДІА': 'MEDIA',
    'ІСТОРІЯ': 'HISTORY',
    'В ПРОЦЕСІ': 'IN PROGRESS',
    'Записи, хроніки та зафіксовані події. Деякі з них навіть правдиві.': 'Records, chronicles, and documented events. Some of them are even true.',
    'АРХІВ': 'ARCHIVE',
    'Рольові ігри та альтернативні реальності. Персонажі мають своє листування.': 'Role-playing games and alternate realities. The characters have their own correspondence.',
    'МЕРЕЖА': 'NETWORK',
    'МАПІНГ': 'MAPPING',
    'Карти, схеми та просторові дані. Географія дивних місць та маршрутів.': 'Maps, diagrams, and spatial data. Geography of strange places and routes.',
    'ГЕО': 'GEO',
    'ДИВНІ ЕКСПЕРИМЕНТИ': 'STRANGE EXPERIMENTS',
    'НЕВІДОМО': 'UNKNOWN',
    'Категорія для всього, що не підходить під інші категорії. Може бути небезпечним. Скоріш за все — ні. Але хто знає.': 'A category for everything that does not fit anywhere else. It may be dangerous. Probably not. But who knows.',
    'НЕВІДОМА КАТЕГОРІЯ': 'UNKNOWN CATEGORY',
    'ЗОБРАЖЕННЯ ВИЛУЧЕНО': 'IMAGE REMOVED',
    'ПРИЧИНА: НАДТО СЕКРЕТНЕ': 'REASON: TOO SECRET',
    'ЛОКАЦІЮ ВИЗНАЧЕНО': 'LOCATION IDENTIFIED',
    'ІМ\'Я: [ВИЛУЧЕНО]': 'NAME: [REDACTED]',
    'ВІДДІЛ: ХАОС ТА ТВОРЧІСТЬ': 'DIVISION: CHAOS AND CREATIVITY',
    'СТАТУС: НЕВІДОМИЙ': 'STATUS: UNKNOWN',
    'РІВЕНЬ ЗАГРОЗИ: МІНІМАЛЬНИЙ': 'THREAT LEVEL: MINIMAL',
    'ПІДТВ.': 'VERIF.',
    'ГРАФІК ДИВНОЇ АКТИВНОСТІ 2024': 'STRANGE ACTIVITY GRAPH 2024',
    'КАРТА: МАРШРУТ НЕВІДОМИЙ': 'MAP: ROUTE UNKNOWN',
    'ФАЙЛ ПОШКОДЖЕНО': 'FILE DAMAGED',
    'СПРОБА ВІДНОВЛЕННЯ...': 'RECOVERY ATTEMPT...',
    '60% ЗАВЕРШЕНО': '60% COMPLETE',
    'ОСОБОВА СПРАВА': 'PERSONAL FILE',
    'КООРДИНАТИ': 'COORDINATES',
    'АНАЛІЗ ДАНИХ': 'DATA ANALYSIS',
    'ТОПОГРАФІЯ': 'TOPOGRAPHY',
    'ПОШКОДЖЕНО': 'DAMAGED',
    'НИЗЬКИЙ': 'LOW',
    'СЕРЕДНІЙ': 'MEDIUM',
    'ВАЖЛИВИЙ': 'IMPORTANT',
    'Сьогодні намагався систематизувати всі свої проєкти. Нарахував їх тридцять сім. Завершених — нуль. Це не може бути нормальним явищем. Почну нову таблицю.': 'Today I tried to organize all my projects. I counted thirty-seven. Completed: zero. This cannot be normal. I will start a new spreadsheet.',
    '#організація': '#organization',
    '#проблеми': '#problems',
    '#таблиці-не-допомагають': '#spreadsheets-do-not-help',
    '#архів': '#archive',
    '#археологія': '#archaeology',
    '#страх': '#fear',
    'Сайт живий. Це офіційно найбільше досягнення за останні три місяці. Планую додати ще п\'ять секцій, переробити дизайн і написати сорок записів у журналі. Або — ні. Подивимось.': 'The site is alive. Officially my biggest achievement of the last three months. I plan to add five more sections, redesign everything, and write forty log entries. Or not. We will see.',
    '#сайт': '#site',
    '#успіх': '#success',
    '#можливо': '#possibly',
    'КОМУНІКАЦІЙНИЙ ТЕРМІНАЛ': 'COMMUNICATION TERMINAL',
    'ГОТОВО': 'READY',
    'Якщо ви хочете зв\'язатися — натисніть кнопку нижче.': 'If you want to get in touch, press the button below.',
    'Повідомлення буде доставлено найближчим часом.': 'The message will be delivered as soon as possible.',
    'Або ні. Залежить від обставин.': 'Or not. It depends on the circumstances.',
    'НАДІСЛАТИ СИГНАЛ': 'SEND SIGNAL',
    'ФАЙЛ: АБСОЛЮТНО-НЕ-СЕКРЕТНО': 'FILE: ABSOLUTELY-NOT-SECRET',
    'РОЗСЕКРЕЧЕНО': 'DECLASSIFIED',
    'УВАГА!': 'ATTENTION!',
    'доступ до абсолютно не секретних файлів відкрито': 'access to absolutely not secret files granted',
    'Ви знайшли прихований файл. Вітаємо. Всередині нічого цікавого немає, але ви молодець, що шукали.': 'You found a hidden file. Congratulations. There is nothing interesting inside, but good work for looking.',
    '> ЗАВАНТАЖЕННЯ АБСОЛЮТНО НЕ СЕКРЕТНИХ ФАЙЛІВ...': '> LOADING ABSOLUTELY NOT SECRET FILES...',
    '> ФАЙЛІВ ЗНАЙДЕНО: 0': '> FILES FOUND: 0',
    '> ПОМИЛОК ЗНАЙДЕНО: 0': '> ERRORS FOUND: 0',
    '> ТАЄМНИЦЬ: НЕМАЄ': '> SECRETS: NONE',
    '> КАВА: МОЖЛИВО': '> COFFEE: POSSIBLY',
    'СИСТЕМА АКТИВНА': 'SYSTEM ACTIVE',
    'УСІХ ПРАВ НЕ ЗАХИЩЕНО': 'ALL RIGHTS UNSECURED'
  };

  function translateTextNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var node;

    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach(function(textNode) {
      var original = textNode.nodeValue;
      var normalized = original.replace(/\s+/g, ' ').trim();
      var replacement = textMap[normalized];

      if (!replacement) return;

      var leading = (original.match(/^\s*/) || [''])[0];
      var trailing = (original.match(/\s*$/) || [''])[0];
      textNode.nodeValue = leading + replacement + trailing;
    });
  }

  function translateLongLogEntry() {
    var logEntries = document.querySelectorAll('.log-entry .log-body p');
    if (logEntries[1]) {
      logEntries[1].innerHTML =
        'I found an old project on a hard drive. I do not remember what it is. ' +
        'The file is called <code>FINAL_VERSION_DEFINITELY_FINAL_v47.zip</code>. ' +
        'Inside are three more archives. The investigation continues.';
    }
  }

  function updateEnglishAttributes() {
    document.documentElement.lang = 'en';
    document.title = 'NOT-VERY-SECRET';
    document.querySelector('meta[name="description"]').setAttribute(
      'content',
      'NOT-VERY-SECRET — a personal archive of strange ideas and accidental projects'
    );
    function setAttr(selector, attr, value) {
      var el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    }

    setAttr('#nav', 'aria-label', 'Main navigation');
    setAttr('#navToggle', 'aria-label', 'Open menu');
    setAttr('#openFileBtn', 'aria-label', 'Open dossier');
    setAttr('#openTrophyBtn', 'aria-label', 'Open trophy shop');
    setAttr('#sendSignalBtn', 'aria-label', 'Send signal');
    setAttr('#closeModal', 'aria-label', 'Close');
    setAttr('#busts', 'aria-label', 'Bust archive');
    setAttr('.bust-browser', 'aria-label', 'Bust archive');
    setAttr('label[for="bustSearch"]', 'aria-label', 'Search the bust archive');
    setAttr('#bustPrevious', 'aria-label', 'Previous bust');
    setAttr('#bustNext', 'aria-label', 'Next bust');
    setAttr('.bust-pagination', 'aria-label', 'Bust selection');
    document.querySelectorAll('.bust-dot').forEach(function(dot, index) {
      dot.setAttribute('aria-label', 'Bust ' + (index + 1));
    });
  }

  function setLanguage(language) {
    localStorage.setItem('nds-language', language);
    window.location.reload();
  }

  document.querySelectorAll('.language-button').forEach(function(button) {
    var selected = button.getAttribute('data-language') === siteLanguage;
    button.setAttribute('aria-pressed', String(selected));
    button.addEventListener('click', function() {
      setLanguage(button.getAttribute('data-language'));
    });
  });

  if (siteLanguage === 'en') {
    translateTextNodes();
    translateLongLogEntry();
    updateEnglishAttributes();
  }
})();


/* TROPHY MARKET */
(function initTrophyMarket() {
  var listingsEl = document.getElementById('trophyListings');
  var countEl = document.getElementById('trophyCount');
  var codeForm = document.getElementById('sellerCodeForm');
  var postForm = document.getElementById('sellerPostForm');
  var feedback = document.getElementById('sellerFeedback');
  var clearBtn = document.getElementById('clearTrophiesBtn');
  var categoryButtons = document.querySelectorAll('.trophy-category');
  if (!listingsEl || !countEl) return;

  var sellerCode = 'TROPHY-7734';
  var storageKey = 'nds-trophy-listings';
  var activeCategory = 'all';

  var defaultListings = siteLanguage === 'en' ? [
    {
      id: 'TR-001',
      name: 'DUSTY VICTORY CUP',
      price: '€45',
      oldPrice: '€60',
      status: 'available',
      category: 'cups',
      condition: 'GOOD / ARCHIVED',
      contact: 'seller@example.eu',
      description: 'A small metal cup with heroic scratches and absolutely no certificate of glory.'
    },
    {
      id: 'TR-002',
      name: 'GREEN FILE MEDAL',
      price: '€18',
      status: 'reserved',
      category: 'medals',
      condition: 'RESTORED',
      contact: 'seller@example.eu',
      description: 'Awarded for surviving a suspiciously long project folder. Ribbon included.'
    },
    {
      id: 'TR-003',
      name: 'CLASSIFIED DESK RELIC',
      price: '€32',
      status: 'available',
      category: 'souvenirs',
      condition: 'ODDLY CLEAN',
      contact: 'seller@example.eu',
      description: 'A souvenir object from an unknown desk. Emits strong administrative energy.'
    }
  ] : [
    {
      id: 'TR-001',
      name: 'ПИЛЬНИЙ КУБОК ПЕРЕМОГИ',
      price: '€45',
      oldPrice: '€60',
      status: 'available',
      category: 'cups',
      condition: 'ДОБРИЙ / В АРХІВІ',
      contact: 'seller@example.eu',
      description: 'Малий металевий кубок з героїчними подряпинами і без жодного сертифіката слави.'
    },
    {
      id: 'TR-002',
      name: 'МЕДАЛЬ ЗЕЛЕНОГО ФАЙЛУ',
      price: '€18',
      status: 'reserved',
      category: 'medals',
      condition: 'ВІДНОВЛЕНО',
      contact: 'seller@example.eu',
      description: 'Видана за виживання у підозріло довгій папці проєкту. Стрічка додається.'
    },
    {
      id: 'TR-003',
      name: 'ЗАСЕКРЕЧЕНИЙ НАСТІЛЬНИЙ РЕЛІКТ',
      price: '€32',
      status: 'available',
      category: 'souvenirs',
      condition: 'ПІДОЗРІЛО ЧИСТИЙ',
      contact: 'seller@example.eu',
      description: 'Сувенірний об’єкт з невідомого столу. Випромінює сильну адміністративну енергію.'
    }
  ];

  var labels = siteLanguage === 'en' ? {
    available: 'AVAILABLE',
    reserved: 'RESERVED',
    sold: 'SOLD',
    request: 'REQUEST PURCHASE',
    noContact: 'contact unavailable',
    codeOk: 'Access granted. Seller console unlocked.',
    codeBad: 'Access denied. Check the special code.',
    published: 'Listing published locally.',
    cleared: 'Local seller posts cleared.'
  } : {
    available: 'ДОСТУПНО',
    reserved: 'ЗАРЕЗЕРВОВАНО',
    sold: 'ПРОДАНО',
    request: 'ЗАПИТ НА КУПІВЛЮ',
    noContact: 'контакт недоступний',
    codeOk: 'Доступ дозволено. Консоль продавця відкрито.',
    codeBad: 'Доступ відхилено. Перевірте спеціальний код.',
    published: 'Оголошення опубліковано локально.',
    cleared: 'Локальні пости продавця очищено.'
  };

  var categoryLabels = siteLanguage === 'en' ? {
    cups: 'CUPS',
    medals: 'MEDALS',
    souvenirs: 'SOUVENIRS',
    other: 'OTHER'
  } : {
    cups: 'КУБКИ',
    medals: 'МЕДАЛІ',
    souvenirs: 'СУВЕНІРИ',
    other: 'ІНШЕ'
  };

  function readListings() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return (Array.isArray(saved) ? saved : []).concat(defaultListings);
    } catch (e) {
      return defaultListings;
    }
  }

  function readCustomListings() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (e) {
      return [];
    }
  }

  function escapeText(value) {
    return String(value || '').replace(/[&<>"']/g, function(char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function contactHref(item) {
    if (!item.contact) return '#sellerAccess';
    if (item.contact.indexOf('@') !== -1) {
      return 'mailto:' + encodeURIComponent(item.contact) +
        '?subject=' + encodeURIComponent('Trophy request: ' + item.name);
    }
    return '#sellerAccess';
  }

  function renderListings() {
    var listings = readListings();
    var visibleListings = listings.filter(function(item) {
      return activeCategory === 'all' || item.category === activeCategory;
    });
    countEl.textContent = String(visibleListings.length).padStart(3, '0');
    listingsEl.innerHTML = visibleListings.map(function(item, index) {
      var status = item.status || 'available';
      return '<article class="trophy-card">' +
        '<span class="trophy-id">' + escapeText(item.id || ('TR-' + String(index + 1).padStart(3, '0'))) + '</span>' +
        '<span class="trophy-category-label">' + escapeText(categoryLabels[item.category] || categoryLabels.other) + '</span>' +
        '<h3 class="trophy-name">' + escapeText(item.name) + '</h3>' +
        '<span class="trophy-condition">' + escapeText(item.condition || '') + '</span>' +
        '<p class="trophy-desc">' + escapeText(item.description) + '</p>' +
        '<div class="trophy-meta">' +
          (item.oldPrice ? '<span class="trophy-old-price">' + escapeText(item.oldPrice) + '</span>' : '') +
          '<span class="trophy-price">' + escapeText(item.price) + '</span>' +
          '<span class="trophy-status trophy-status--' + escapeText(status) + '">' + escapeText(labels[status] || status) + '</span>' +
        '</div>' +
        '<a class="trophy-buy" href="' + contactHref(item) + '">' + escapeText(labels.request) + ' →</a>' +
      '</article>';
    }).join('');
  }

  function setFeedback(message, kind) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove('is-ok', 'is-error');
    if (kind) feedback.classList.add(kind);
  }

  if (codeForm && postForm) {
    codeForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var codeInput = document.getElementById('sellerCode');
      var code = codeInput ? codeInput.value.trim() : '';
      if (code === sellerCode) {
        postForm.hidden = false;
        setFeedback(labels.codeOk, 'is-ok');
        if (codeInput) codeInput.value = '';
      } else {
        setFeedback(labels.codeBad, 'is-error');
      }
    });

    postForm.addEventListener('submit', function(event) {
      event.preventDefault();
      var customListings = readCustomListings();
      var item = {
        id: 'TR-' + String(defaultListings.length + customListings.length + 1).padStart(3, '0'),
        name: document.getElementById('trophyName').value.trim(),
        price: document.getElementById('trophyPrice').value.trim(),
        oldPrice: document.getElementById('trophyOldPrice').value.trim(),
        status: document.getElementById('trophyStatus').value,
        category: document.getElementById('trophyCategory').value,
        condition: document.getElementById('trophyCondition').value.trim(),
        contact: document.getElementById('trophyContact').value.trim(),
        description: document.getElementById('trophyDescription').value.trim()
      };
      customListings.unshift(item);
      localStorage.setItem(storageKey, JSON.stringify(customListings));
      postForm.reset();
      setFeedback(labels.published, 'is-ok');
      renderListings();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      localStorage.removeItem(storageKey);
      setFeedback(labels.cleared, 'is-ok');
      renderListings();
    });
  }

  categoryButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      activeCategory = button.getAttribute('data-category') || 'all';
      categoryButtons.forEach(function(other) {
        other.classList.toggle('is-active', other === button);
      });
      renderListings();
    });
  });

  renderListings();
})();


/* BUST ARCHIVE BROWSER */
(function initBustBrowser() {
  var stage = document.querySelector('.bust-stage');
  var reference = document.getElementById('bustReference');
  var title = document.querySelector('.bust-placeholder-title');
  var subtitle = document.querySelector('.bust-placeholder-subtitle');
  var search = document.getElementById('bustSearch');
  var previous = document.getElementById('bustPrevious');
  var next = document.getElementById('bustNext');
  var dots = document.querySelectorAll('.bust-dot');
  if (!stage || !reference || !title || !subtitle || !previous || !next || !dots.length) return;

  var activeIndex = 0;
  var busts = siteLanguage === 'en' ? [
    { ref: 'BUST-001', title: 'IN PROGRESS', subtitle: 'ARCHIVE IMAGE PENDING' },
    { ref: 'BUST-002', title: 'PROFILE PENDING', subtitle: 'SCULPTURE DATA NOT YET DECLASSIFIED' },
    { ref: 'BUST-003', title: 'RECONSTRUCTION', subtitle: 'FRAGMENTARY ARCHIVE ENTRY' }
  ] : [
    { ref: 'BUST-001', title: 'В РОЗРОБЦІ', subtitle: 'ЗОБРАЖЕННЯ АРХІВУ ОЧІКУЄТЬСЯ' },
    { ref: 'BUST-002', title: 'ПРОФІЛЬ ОЧІКУЄТЬСЯ', subtitle: 'ДАНІ СКУЛЬПТУРИ ЩЕ НЕ РОЗСЕКРЕЧЕНО' },
    { ref: 'BUST-003', title: 'РЕКОНСТРУКЦІЯ', subtitle: 'ФРАГМЕНТАРНИЙ ЗАПИС АРХІВУ' }
  ];

  function selectBust(index) {
    activeIndex = (index + dots.length) % dots.length;
    var bust = busts[activeIndex];
    reference.textContent = bust.ref;
    title.textContent = bust.title;
    subtitle.textContent = bust.subtitle;
    dots.forEach(function(dot, dotIndex) {
      var selected = dotIndex === activeIndex;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-selected', String(selected));
    });
  }

  function searchBusts() {
    if (!search) return;
    var query = search.value.trim().toLowerCase();
    if (!query) {
      selectBust(activeIndex);
      return;
    }

    var matchIndex = busts.findIndex(function(bust) {
      return [bust.ref, bust.title, bust.subtitle].some(function(value) {
        return value.toLowerCase().indexOf(query) !== -1;
      });
    });

    if (matchIndex >= 0) {
      selectBust(matchIndex);
      return;
    }

    reference.textContent = siteLanguage === 'en' ? 'SEARCH-404' : 'ПОШУК-404';
    title.textContent = siteLanguage === 'en' ? 'NO MATCH' : 'ЗБІГІВ НЕ ЗНАЙДЕНО';
    subtitle.textContent = siteLanguage === 'en'
      ? 'TRY BUST-001, BUST-002, OR BUST-003'
      : 'СПРОБУЙТЕ BUST-001, BUST-002 АБО BUST-003';
    dots.forEach(function(dot) {
      dot.classList.remove('is-active');
      dot.setAttribute('aria-selected', 'false');
    });
  }

  previous.addEventListener('click', function() { selectBust(activeIndex - 1); });
  next.addEventListener('click', function() { selectBust(activeIndex + 1); });
  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() { selectBust(index); });
  });
  stage.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') selectBust(activeIndex - 1);
    if (event.key === 'ArrowRight') selectBust(activeIndex + 1);
  });
  if (search) search.addEventListener('input', searchBusts);

  if (siteLanguage === 'en') {
    var bustsTitle = document.getElementById('bustsTitle');
    var bustSearch = document.getElementById('bustSearch');
    var bustNav = document.querySelector('.nav-link[data-section="busts"]');
    if (bustsTitle) bustsTitle.textContent = 'BUST ARCHIVE';
    if (bustSearch) bustSearch.placeholder = 'SEARCH THE ARCHIVE';
    if (bustNav) bustNav.textContent = 'BUSTS';
    previous.setAttribute('aria-label', 'Previous bust');
    next.setAttribute('aria-label', 'Next bust');
  }

  selectBust(0);
})();
