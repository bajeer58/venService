/**
 * app.js
 * ─────────────────────────────────────────────
 * Main entry point for Ven Service frontend.
 *
 * Responsibilities:
 *  1. Import and initialise all feature modules
 *  2. Expose global helpers needed by HTML onclick attributes
 *     (kept minimal — migrate to event listeners over time)
 *
 * Module load order matters:
 *  config → toast → modal → seats → charts → dashboard → utils → app
 */

import { showToast }                    from './modules/toast.js';
import { initModal, openModal,
         closeModal, goToStep }         from './modules/modal.js';
import { initSeats }                    from './modules/seats.js';
import { renderBarChart }               from './modules/charts.js';
import { initDashboard, openDashTab }   from './modules/dashboard.js';
import { initScrollReveal, setRoute,
         scrollToSection,
         initQuickRoutes,
         initDefaultDate }              from './modules/utils.js';

// ── Bootstrap ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initModal();
  initSeats();
  renderBarChart();
  initDashboard();
  initScrollReveal();
  initQuickRoutes();
  initDefaultDate();
});

// ── Global surface for inline onclick="" attributes ────────────────────────────
// These allow the HTML to remain clean while we progressively move logic here.
// Gradually replace onclick attributes with addEventListener calls.

window.showToast       = showToast;
window.openModal       = openModal;
window.closeModal      = closeModal;
window.goToStep        = goToStep;
window.setRoute        = setRoute;
window.scrollToSection = scrollToSection;
window.openDashTab     = openDashTab;
