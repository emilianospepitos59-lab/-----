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
  if (!btn) return;
  btn.addEventListener('click', function() {
    var target = document.getElementById('about');
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
    document.getElementById('nav').setAttribute('aria-label', 'Main navigation');
    document.getElementById('navToggle').setAttribute('aria-label', 'Open menu');
    document.getElementById('openFileBtn').setAttribute('aria-label', 'Open dossier');
    document.getElementById('sendSignalBtn').setAttribute('aria-label', 'Send signal');
    document.getElementById('closeModal').setAttribute('aria-label', 'Close');
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


/* BUST ARCHIVE BROWSER */
(function initBustBrowser() {
  var stage = document.querySelector('.bust-stage');
  var reference = document.getElementById('bustReference');
  var previous = document.getElementById('bustPrevious');
  var next = document.getElementById('bustNext');
  var dots = document.querySelectorAll('.bust-dot');
  if (!stage || !reference || !previous || !next || !dots.length) return;

  var activeIndex = 0;

  function selectBust(index) {
    activeIndex = (index + dots.length) % dots.length;
    reference.textContent = 'BUST-00' + (activeIndex + 1);
    dots.forEach(function(dot, dotIndex) {
      var selected = dotIndex === activeIndex;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-selected', String(selected));
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

  if (siteLanguage === 'en') {
    document.getElementById('bustsTitle').textContent = 'BUST ARCHIVE';
    document.getElementById('bustSearch').placeholder = 'SEARCH THE ARCHIVE';
    document.querySelector('.nav-link[data-section="busts"]').textContent = 'BUSTS';
    previous.setAttribute('aria-label', 'Previous bust');
    next.setAttribute('aria-label', 'Next bust');
  }
})();
