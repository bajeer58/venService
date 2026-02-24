/**
 * modal.js
 * Controls the multi-step booking modal.
 * Steps: 1 = Passenger details, 2 = Payment, 3 = Confirmation
 */

import { MODAL_STEPS } from '../config/config.js';

let currentStep = 1;

// ── Selectors ─────────────────────────────────────────────────────────────────

const overlay = () => document.getElementById('bookingModal');
const subTitle = () => document.getElementById('modalSub');

function stepEl(n) { return document.getElementById(`formStep${n}`); }
function dotEl(n) { return document.getElementById(`dot${n}`); }

// ── Public API ─────────────────────────────────────────────────────────────────

/** Open the modal and reset to step 1 */
export function openModal() {
  goToStep(1);
  overlay()?.classList.add('open');
}

/** Close the modal */
export function closeModal() {
  overlay()?.classList.remove('open');
}

/** Advance or rewind to a specific step (1–3) */
export function goToStep(step) {
  currentStep = step;

  // Show / hide form steps
  [1, 2, 3].forEach(n => {
    const el = stepEl(n);
    if (el) el.style.display = n === step ? 'block' : 'none';
  });

  // Update progress dots
  [1, 2, 3].forEach(n => {
    const dot = dotEl(n);
    if (!dot) return;
    dot.className = 'step-dot' + (n < step ? ' done' : n === step ? ' active' : '');
  });

  // Update subtitle
  const sub = subTitle();
  if (sub) sub.textContent = MODAL_STEPS[step - 1] ?? '';
}

// ── Event wiring ──────────────────────────────────────────────────────────────

/** Attach event listeners; call once after DOM ready */
export function initModal() {
  // Close when clicking the dark overlay backdrop
  overlay()?.addEventListener('click', e => {
    if (e.target === overlay()) closeModal();
  });

  // Expose helpers to inline onclick attributes still used in HTML
  window._modal = { openModal, closeModal, goToStep };
}
