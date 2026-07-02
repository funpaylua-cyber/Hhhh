// ============ INTRO ============
const intro = document.getElementById('intro');
const introEnter = document.getElementById('introEnter');

function enterSite() {
  intro.classList.add('is-hidden');
  document.body.style.overflow = '';
}

introEnter.addEventListener('click', enterSite);
document.body.style.overflow = 'hidden';

// ============ ОБРАТНЫЙ ОТСЧЁТ ============
const WEDDING_DATE = new Date('2026-09-20T16:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  const els = {
    days: document.getElementById('cdDays'),
    hours: document.getElementById('cdHours'),
    minutes: document.getElementById('cdMinutes'),
    seconds: document.getElementById('cdSeconds'),
  };

  if (diff <= 0) {
    Object.values(els).forEach(el => el.textContent = '00');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  els.days.textContent = String(days).padStart(2, '0');
  els.hours.textContent = String(hours).padStart(2, '0');
  els.minutes.textContent = String(minutes).padStart(2, '0');
  els.seconds.textContent = String(seconds).padStart(2, '0');
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

// ============ ПРОГРЕСС-БАР СКРОЛЛА ============
const progressBar = document.getElementById('progress');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ============ NAV: СКРЫТИЕ ПРИ СКРОЛЛЕ ВНИЗ ============
const nav = document.getElementById('nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  if (currentY > lastScrollY && currentY > 200) {
    nav.classList.add('is-hidden');
  } else {
    nav.classList.remove('is-hidden');
  }
  lastScrollY = currentY;
}, { passive: true });

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
  const scrollTop = window.scrollY;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax);
    el.style.setProperty('--parallax-y', `${scrollTop * speed}px`);
  });
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
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
