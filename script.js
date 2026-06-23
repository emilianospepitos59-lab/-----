/* ============================================================
   НЕ-ДУЖЕ-СЕКРЕТНО — Скрипт
   ============================================================ */

'use strict';

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

  var subtitleText = 'Особистий архів дивних ідей та випадкових проєктів';
  var terminalSteps = [
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

  var steps = [
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
