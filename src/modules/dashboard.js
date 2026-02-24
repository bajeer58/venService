/**
 * dashboard.js
 * Controls the Admin / Staff dashboard tab switcher.
 */

const TABS = ['admin', 'staff'];

/**
 * Switch the visible dashboard panel and highlight the active tab button.
 * @param {string} tab  - 'admin' | 'staff'
 */
export function switchTab(tab) {
  if (!TABS.includes(tab)) return;

  // Deactivate all tabs and panels
  document.querySelectorAll('.dash-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.dash-panel').forEach(el => el.classList.remove('active'));

  // Activate target
  const panel = document.getElementById(`panel-${tab}`);
  panel?.classList.add('active');

  // Highlight matching tab button by data-tab attribute
  const tabBtn = document.querySelector(`.dash-tab[data-tab="${tab}"]`);
  tabBtn?.classList.add('active');
}

/**
 * Scroll to the dashboard section and activate a specific tab.
 * Useful when navigating from the nav "Staff Login" button.
 * @param {string} tab
 */
export function openDashTab(tab) {
  document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Small delay to let the scroll settle before switching UI
  setTimeout(() => switchTab(tab), 450);
}

/**
 * Attach click listeners to all .dash-tab elements.
 * Call once after DOM is ready.
 */
export function initDashboard() {
  document.querySelectorAll('.dash-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Default: show admin panel on load
  switchTab('admin');
}
