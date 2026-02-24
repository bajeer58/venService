/**
 * seats.js
 * Manages the interactive van seat map.
 * Handles state, rendering, selection, and price calculation.
 */

import {
  INITIAL_SEAT_DATA,
  PRICE_PER_SEAT,
  SERVICE_FEE_RATE,
  seatLabel,
  formatPKR,
} from '../config/config.js';
import { openModal } from './modal.js';

// ── State ─────────────────────────────────────────────────────────────────────

/** @type {string[]} Current status for every seat */
let seats = [...INITIAL_SEAT_DATA];

/** @type {Set<number>} Indices of seats the user has selected */
let selectedSeats = new Set();

// ── Seat emoji & class maps ────────────────────────────────────────────────────

const SEAT_ICONS = {
  available: '💺',
  selected: '✅',
  booked: '🚫',
  locked: '🔒',
};

const SEAT_CLASS = {
  available: 's-available',
  selected: 's-selected',
  booked: 's-booked',
  locked: 's-locked',
};

// ── Rendering ─────────────────────────────────────────────────────────────────

/**
 * Build and inject all seat buttons into #seatGrid.
 */
export function renderSeats() {
  const grid = document.getElementById('seatGrid');
  if (!grid) return;

  grid.innerHTML = '';

  seats.forEach((status, i) => {
    const btn = document.createElement('button');
    btn.className = `seat-btn ${SEAT_CLASS[status] ?? ''}`;
    btn.setAttribute('aria-label', `Seat ${seatLabel(i)} — ${status}`);

    btn.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        <span style="font-size:16px">${SEAT_ICONS[status] ?? '?'}</span>
        <span class="seat-num">${seatLabel(i)}</span>
      </div>`;

    // Only interactive for available / selected seats
    if (status === 'available' || status === 'selected') {
      btn.addEventListener('click', () => toggleSeat(i));
    } else {
      btn.disabled = true;
    }

    grid.appendChild(btn);
  });

  updateSummary();
}

// ── Selection logic ────────────────────────────────────────────────────────────

/**
 * Toggle a seat between available ↔ selected.
 * @param {number} index
 */
function toggleSeat(index) {
  if (seats[index] === 'available') {
    seats[index] = 'selected';
    selectedSeats.add(index);
  } else if (seats[index] === 'selected') {
    seats[index] = 'available';
    selectedSeats.delete(index);
  }
  renderSeats();
}

// ── Summary panel ──────────────────────────────────────────────────────────────

/**
 * Sync the booking summary sidebar with current selection.
 */
function updateSummary() {
  const count = selectedSeats.size;
  const subtotal = count * PRICE_PER_SEAT;
  const fee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + fee;

  // Update numeric cells
  setEl('seatCount', String(count));
  setEl('serviceFee', formatPKR(fee));
  setEl('totalPrice', formatPKR(total));

  // Update selected-seats tag display
  const display = document.getElementById('selectedSeatsDisplay');
  if (display) {
    if (count > 0) {
      display.innerHTML = '';
      selectedSeats.forEach(i => {
        const tag = document.createElement('div');
        tag.className = 'seat-tag';
        tag.textContent = seatLabel(i);
        display.appendChild(tag);
      });
    } else {
      display.innerHTML = '<div class="empty-seats-msg">No seats selected yet. Tap a green seat above.</div>';
    }
  }

  // Update book button
  const btn = document.getElementById('bookBtn');
  if (btn) {
    btn.disabled = count === 0;
    btn.textContent = count > 0
      ? `Book ${count} Seat${count > 1 ? 's' : ''} — ${formatPKR(total)}`
      : 'Select seats to continue';
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── Init ───────────────────────────────────────────────────────────────────────

/** Wire up the Book button and render initial seat grid. Call once on DOMContentLoaded. */
export function initSeats() {
  const btn = document.getElementById('bookBtn');
  btn?.addEventListener('click', () => {
    if (selectedSeats.size > 0) openModal();
  });

  renderSeats();
}
