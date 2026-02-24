/**
 * utils.js
 * General utility helpers:
 *  - Smooth scroll to section
 *  - Intersection Observer scroll-reveal
 *  - Hero quick-route setter
 *  - Default date initializer
 */

import { QUICK_ROUTES } from '../config/config.js';
import { showToast } from './toast.js';

// ── Scroll helpers ─────────────────────────────────────────────────────────────

/**
 * Smoothly scroll to any section by its ID.
 * @param {string} id - Element ID without the '#'
 */
export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Scroll-reveal observer ─────────────────────────────────────────────────────

/**
 * Observe all `.reveal` elements and add `.visible` when they enter the viewport.
 */
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 },
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Quick routes (hero section) ────────────────────────────────────────────────

/**
 * Set hero search dropdowns to a predefined route and scroll to the seat map.
 * @param {string} from
 * @param {string} to
 */
export function setRoute(from, to) {
  const fromEl = document.getElementById('fromCity');
  const toEl = document.getElementById('toCity');

  if (fromEl) fromEl.value = from;
  if (toEl) toEl.value = to;

  scrollToSection('seat-section');
  showToast(`Route set: ${from} → ${to} 🚐`);
}

/**
 * Wire up quick-route link buttons in the hero search card.
 */
export function initQuickRoutes() {
  const container = document.getElementById('quickLinks');
  if (!container) return;

  QUICK_ROUTES.forEach(({ from, to }) => {
    const btn = document.createElement('div');
    btn.className = 'quick-link';
    btn.textContent = `🚐 ${from} → ${to}`;
    btn.addEventListener('click', () => setRoute(from, to));
    container.appendChild(btn);
  });
}

// ── Default date ───────────────────────────────────────────────────────────────

/**
 * Pre-fill the travel date input to tomorrow's date.
 */
export function initDefaultDate() {
  const dateInput = document.getElementById('travelDate');
  if (!dateInput) return;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.valueAsDate = tomorrow;
}
