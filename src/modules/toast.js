/**
 * toast.js
 * Lightweight toast notification system.
 * Supports icon variants and auto-dismiss.
 */

const TOAST_DURATION_MS = 3200;

let dismissTimer = null;

/**
 * Show a toast notification.
 * @param {string}  message        - Text to display.
 * @param {'success'|'error'|'info'} [variant='success']
 */
export function showToast(message, variant = 'success') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  const iconEl = toast?.querySelector('.toast-icon');

  if (!toast || !msgEl) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  if (iconEl) iconEl.textContent = icons[variant] ?? '✅';

  msgEl.textContent = message;
  toast.classList.add('show');

  clearTimeout(dismissTimer);
  dismissTimer = setTimeout(() => toast.classList.remove('show'), TOAST_DURATION_MS);
}
