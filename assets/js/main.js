// ============ КОНВЕРТ: открытие приглашения ============
const envelopeScreen = document.getElementById('envelopeScreen');
const openInviteBtn = document.getElementById('openInvite');

function openInvitation() {
  envelopeScreen.classList.add('is-hidden');
  document.body.style.overflow = '';
}

openInviteBtn.addEventListener('click', openInvitation);
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

// ============ АКТИВНАЯ ТОЧКА НАВИГАЦИИ ============
const sections = document.querySelectorAll('main section[id]');
const dotItems = document.querySelectorAll('.dot-nav__item');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      dotItems.forEach(dot => {
        dot.classList.toggle('is-active', dot.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => navObserver.observe(section));

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
