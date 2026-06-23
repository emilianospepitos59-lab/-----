/* ============================================================
   НЕ-ДУЖЕ-СЕКРЕТНО — interactions and translation
   ============================================================ */

'use strict';

const translations = {
  uk: {
    navDossier: 'Досьє',
    navTimeline: 'Хронологія',
    navGallery: 'Галерея',
    heroKicker: 'особова справа',
    heroSubtitle: 'Особистий архів версій, фотофайлів і дивних етапів.',
    openFile: 'Відкрити досьє',
    dossierTitle: 'Картка досьє',
    stampVerified: 'Перевірено',
    fieldName: 'Ім\'я',
    fieldStatus: 'Статус',
    fieldStatusValue: 'активний архів',
    fieldMode: 'Режим',
    fieldModeValue: 'військовий файл / особиста хронологія',
    fieldAccess: 'Доступ',
    fieldAccessValue: 'не дуже секретно',
    dossierText: 'Це не офіційний архів і не серйозна біографія. Це темний файл із кількома версіями, спогадами, фото й трохи театру.',
    timelineTitle: 'Хронологія версій',
    galleryTitle: 'Фотоархів',
    galleryMap: 'маршрут',
    gallerySignal: 'сигнал',
    galleryRedacted: 'вилучено',
    footerText: 'усіх прав не захищено',
    versions: [
      {
        id: 'FILE-01',
        title: 'ВДВ 2022',
        text: 'Перший знімок у справі. Сирий, темний, але важливий.',
        mark: '2022',
        bg: 'linear-gradient(135deg, #0c130d, #1c2918 48%, #060806)'
      },
      {
        id: 'FILE-02',
        title: 'Russian 2022',
        text: 'Інша версія того самого року: холодніша, жорсткіша, майже документальна.',
        mark: 'RU',
        bg: 'linear-gradient(135deg, #100d0d, #2a2119 45%, #060806)'
      },
      {
        id: 'FILE-03',
        title: 'Польща 2023',
        text: 'Файл із дороги. Більше повітря, більше шуму, новий фон.',
        mark: 'PL',
        bg: 'linear-gradient(135deg, #0b1112, #16272b 48%, #070908)'
      },
      {
        id: 'FILE-04',
        title: 'Невідома версія',
        text: 'Запис без повної назви. Його залишили в архіві, бо він виглядає підозріло добре.',
        mark: '???',
        bg: 'linear-gradient(135deg, #0c0f0a, #2c3016 52%, #050806)'
      }
    ]
  },
  en: {
    navDossier: 'Dossier',
    navTimeline: 'Timeline',
    navGallery: 'Gallery',
    heroKicker: 'personal file',
    heroSubtitle: 'A personal archive of versions, photo files, and strange phases.',
    openFile: 'Open dossier',
    dossierTitle: 'Dossier card',
    stampVerified: 'Verified',
    fieldName: 'Name',
    fieldStatus: 'Status',
    fieldStatusValue: 'active archive',
    fieldMode: 'Mode',
    fieldModeValue: 'military file / personal chronology',
    fieldAccess: 'Access',
    fieldAccessValue: 'not very secret',
    dossierText: 'This is not an official archive and not a serious biography. It is a dark file with a few versions, memories, photos, and a little theatre.',
    timelineTitle: 'Version timeline',
    galleryTitle: 'Photo archive',
    galleryMap: 'route',
    gallerySignal: 'signal',
    galleryRedacted: 'redacted',
    footerText: 'all rights unsecured',
    versions: [
      {
        id: 'FILE-01',
        title: 'VDV 2022',
        text: 'The first image in the file. Raw, dark, and somehow important.',
        mark: '2022',
        bg: 'linear-gradient(135deg, #0c130d, #1c2918 48%, #060806)'
      },
      {
        id: 'FILE-02',
        title: 'Russian 2022',
        text: 'Another version from the same year: colder, harder, almost documentary.',
        mark: 'RU',
        bg: 'linear-gradient(135deg, #100d0d, #2a2119 45%, #060806)'
      },
      {
        id: 'FILE-03',
        title: 'Poland 2023',
        text: 'A file from the road. More air, more noise, a new background.',
        mark: 'PL',
        bg: 'linear-gradient(135deg, #0b1112, #16272b 48%, #070908)'
      },
      {
        id: 'FILE-04',
        title: 'Unknown version',
        text: 'A record without a full name. It stayed in the archive because it looks suspiciously good.',
        mark: '???',
        bg: 'linear-gradient(135deg, #0c0f0a, #2c3016 52%, #050806)'
      }
    ]
  }
};

let currentLang = localStorage.getItem('siteLang') || 'uk';
let currentVersion = 0;

(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let cx = -100;
  let cy = -100;
  let raf = null;

  function moveCursor(event) {
    cx = event.clientX;
    cy = event.clientY;
    if (raf) return;

    raf = requestAnimationFrame(function() {
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      raf = null;
    });
  }

  document.addEventListener('mousemove', moveCursor);
  document.addEventListener('mouseenter', function() {
    document.body.classList.add('cursor-active');
  });
  document.addEventListener('mouseleave', function() {
    document.body.classList.remove('cursor-active');
  });
})();

function applyLanguage(lang) {
  currentLang = translations[lang] ? lang : 'uk';
  localStorage.setItem('siteLang', currentLang);
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(function(element) {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach(function(button) {
    button.classList.toggle('active', button.dataset.lang === currentLang);
  });

  renderVersion(currentVersion, false);
}

function renderVersion(index, animate) {
  const files = translations[currentLang].versions;
  currentVersion = (index + files.length) % files.length;

  const file = files[currentVersion];
  const card = document.getElementById('versionCard');
  const image = document.getElementById('versionImage');
  const id = document.getElementById('versionId');
  const title = document.getElementById('versionTitle');
  const text = document.getElementById('versionText');

  if (!card || !image || !id || !title || !text) return;

  if (animate) {
    card.classList.add('is-changing');
  }

  setTimeout(function() {
    image.style.setProperty('--version-bg', file.bg);
    image.setAttribute('data-mark', file.mark);
    id.textContent = file.id;
    title.textContent = file.title;
    text.textContent = file.text;

    document.querySelectorAll('.timeline-dot').forEach(function(dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentVersion);
      dot.setAttribute('aria-current', dotIndex === currentVersion ? 'true' : 'false');
    });

    card.classList.remove('is-changing');
  }, animate ? 180 : 0);
}

function buildTimelineDots() {
  const holder = document.getElementById('timelineDots');
  if (!holder) return;

  holder.innerHTML = '';
  translations.uk.versions.forEach(function(_, index) {
    const button = document.createElement('button');
    button.className = 'timeline-dot';
    button.type = 'button';
    button.setAttribute('aria-label', 'Open file ' + (index + 1));
    button.addEventListener('click', function() {
      renderVersion(index, true);
    });
    holder.appendChild(button);
  });
}

(function initLanguageButtons() {
  document.querySelectorAll('.lang-btn').forEach(function(button) {
    button.addEventListener('click', function() {
      applyLanguage(button.dataset.lang);
    });
  });
})();

(function initVersionControls() {
  buildTimelineDots();

  const prev = document.getElementById('prevVersion');
  const next = document.getElementById('nextVersion');

  if (prev) {
    prev.addEventListener('click', function() {
      renderVersion(currentVersion - 1, true);
    });
  }

  if (next) {
    next.addEventListener('click', function() {
      renderVersion(currentVersion + 1, true);
    });
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') renderVersion(currentVersion - 1, true);
    if (event.key === 'ArrowRight') renderVersion(currentVersion + 1, true);
  });
})();

applyLanguage(currentLang);
