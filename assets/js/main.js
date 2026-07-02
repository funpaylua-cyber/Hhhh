const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ ПЛАВНЫЙ ИНЕРЦИОННЫЙ СКРОЛЛ ============
const smoothWrapper = document.getElementById('smoothWrapper');
let currentScroll = window.scrollY;
let targetScroll = window.scrollY;
window.__smoothScrollY = currentScroll;

function setBodyHeight() {
  document.body.style.height = `${smoothWrapper.scrollHeight}px`;
}

if (!prefersReducedMotion && smoothWrapper) {
  setBodyHeight();
  window.addEventListener('resize', setBodyHeight);
  if ('ResizeObserver' in window) {
    new ResizeObserver(setBodyHeight).observe(smoothWrapper);
  }
  window.addEventListener('load', setBodyHeight);
  document.fonts && document.fonts.ready.then(setBodyHeight).catch(() => {});

  window.addEventListener('scroll', () => { targetScroll = window.scrollY; }, { passive: true });

  function smoothRaf() {
    currentScroll += (targetScroll - currentScroll) * 0.085;
    if (Math.abs(targetScroll - currentScroll) < 0.05) currentScroll = targetScroll;
    smoothWrapper.style.transform = `translate3d(0, ${-currentScroll}px, 0)`;
    window.__smoothScrollY = currentScroll;
    requestAnimationFrame(smoothRaf);
  }
  requestAnimationFrame(smoothRaf);
}

function getScrollY() {
  return prefersReducedMotion ? window.scrollY : window.__smoothScrollY;
}

// ============ ЯКОРНАЯ НАВИГАЦИЯ (для фикс-обёртки плавного скролла) ============
function scrollToHash(hash) {
  const target = document.querySelector(hash);
  if (!target || !smoothWrapper) return false;
  const wrapperTop = smoothWrapper.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  const naturalOffset = targetTop - wrapperTop; // положение цели внутри обёртки, не зависит от текущего скролла
  const navHeight = window.innerWidth <= 780 ? 0 : 78;
  window.scrollTo({ top: Math.max(naturalOffset - navHeight, 0), behavior: 'auto' });
  return true;
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const hash = link.getAttribute('href');
    if (!hash || hash.length < 2) return;
    if (scrollToHash(hash)) e.preventDefault();
  });
});

if (window.location.hash) {
  window.addEventListener('load', () => scrollToHash(window.location.hash));
}

// ============ INTRO ============
const intro = document.getElementById('intro');
const introEnter = document.getElementById('introEnter');

function enterSite() {
  intro.classList.add('is-hidden');
  document.body.classList.add('site-entered');
  document.body.style.overflow = '';
  setBodyHeight();
}

introEnter.addEventListener('click', enterSite);
document.body.style.overflow = 'hidden';

// ============ ОБРАТНЫЙ ОТСЧЁТ (с флип-анимацией) ============
const WEDDING_DATE = new Date('2026-09-20T16:00:00');
const cdEls = {
  days: document.getElementById('cdDays'),
  hours: document.getElementById('cdHours'),
  minutes: document.getElementById('cdMinutes'),
  seconds: document.getElementById('cdSeconds'),
};
const cdPrev = { days: null, hours: null, minutes: null, seconds: null };

function setDigit(el, key, value) {
  const str = String(value).padStart(2, '0');
  if (cdPrev[key] !== null && cdPrev[key] !== str) {
    el.classList.remove('is-ticking');
    void el.offsetWidth;
    el.classList.add('is-ticking');
  }
  el.textContent = str;
  cdPrev[key] = str;
}

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();

  if (diff <= 0) {
    Object.values(cdEls).forEach(el => el.textContent = '00');
    return;
  }

  setDigit(cdEls.days, 'days', Math.floor(diff / (1000 * 60 * 60 * 24)));
  setDigit(cdEls.hours, 'hours', Math.floor((diff / (1000 * 60 * 60)) % 24));
  setDigit(cdEls.minutes, 'minutes', Math.floor((diff / (1000 * 60)) % 60));
  setDigit(cdEls.seconds, 'seconds', Math.floor((diff / 1000) % 60));
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ============ ПРОГРЕСС-БАР + NAV: СКРЫТИЕ ПРИ СКРОЛЛЕ ============
const progressBar = document.getElementById('progress');
const nav = document.getElementById('nav');
let lastY = getScrollY();

function updateOnScroll() {
  const y = getScrollY();
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;

  if (y > lastY + 2 && y > 200) {
    nav.classList.add('is-hidden');
  } else if (y < lastY - 2 || y <= 200) {
    nav.classList.remove('is-hidden');
  }
  lastY = y;

  requestAnimationFrame(updateOnScroll);
}
requestAnimationFrame(updateOnScroll);

// ============ МОБИЛЬНОЕ МЕНЮ ============
const navBurger = document.getElementById('navBurger');
const navMobile = document.getElementById('navMobile');

navBurger.addEventListener('click', () => {
  navMobile.classList.toggle('is-open');
  navBurger.classList.toggle('is-open');
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('is-open');
    navBurger.classList.remove('is-open');
  });
});

// ============ ЗВУК ============
const soundToggle = document.getElementById('soundToggle');
const bgMusic = document.getElementById('bgMusic');

soundToggle.addEventListener('click', () => {
  const isPlaying = soundToggle.classList.toggle('is-playing');
  soundToggle.setAttribute('aria-pressed', String(isPlaying));
  soundToggle.setAttribute('aria-label', isPlaying ? 'Выключить музыку' : 'Включить музыку');
  if (isPlaying) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
});

// ============ ПАРАЛЛАКС ============
const parallaxEls = document.querySelectorAll('[data-parallax]');

function updateParallax() {
  const y = getScrollY();
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax);
    el.style.setProperty('--parallax-y', `${y * speed}px`);
  });
  requestAnimationFrame(updateParallax);
}

if (!prefersReducedMotion) {
  requestAnimationFrame(updateParallax);
}

// ============ КАСТОМНЫЙ КУРСОР ============
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
  let mouseX = ringX, mouseY = ringY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    cursorDot.classList.add('is-active');
    cursorRing.classList.add('is-active');
  }, { once: false });

  function ringRaf() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(ringRaf);
  }
  requestAnimationFrame(ringRaf);

  document.querySelectorAll('a, button, .gallery__tile, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
  });
}

// ============ МАГНИТНЫЕ КНОПКИ ============
if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.btn, .intro__enter').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ============ 3D-НАКЛОН КАРТОЧЕК ============
if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-py * 10}deg) rotateY(${px * 10}deg) translateY(-6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============ RSVP ФОРМА ============
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');

rsvpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!rsvpForm.checkValidity()) {
    rsvpForm.reportValidity();
    return;
  }
  rsvpSuccess.classList.add('is-visible');
  rsvpForm.querySelector('.btn--solid').textContent = 'Ответ отправлен ✓';
  rsvpForm.querySelector('.btn--solid').disabled = true;
});
