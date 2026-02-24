/**
 * config.js
 * Central constants and shared data for the Ven Service platform.
 * Import from this file; never hardcode values elsewhere.
 */

export const PRICE_PER_SEAT = 3500;
export const SERVICE_FEE_RATE = 0.05; // 5%
export const SEAT_HOLD_MINUTES = 5;

/** @type {('available'|'selected'|'booked'|'locked')[]} */
export const INITIAL_SEAT_DATA = [
  'booked',    'available', 'available', 'available',
  'available', 'locked',    'available', 'booked',
  'available', 'available', 'booked',    'available',
  'available', 'available', 'available', 'available',
  'booked',    'available', 'available', 'locked',
];

/** Weekly bookings data for bar chart */
export const WEEKLY_BOOKINGS = [
  { day: 'Mon', count: 82  },
  { day: 'Tue', count: 124 },
  { day: 'Wed', count: 98  },
  { day: 'Thu', count: 156 },
  { day: 'Fri', count: 210 },
  { day: 'Sat', count: 189 },
  { day: 'Sun', count: 347 },
];

/** Featured routes displayed in the hero quick-links */
export const QUICK_ROUTES = [
  { from: 'Karachi',   to: 'Islamabad' },
  { from: 'Lahore',    to: 'Peshawar'  },
  { from: 'Multan',    to: 'Lahore'    },
  { from: 'Islamabad', to: 'Karachi'   },
];

/** Booking modal step labels */
export const MODAL_STEPS = [
  'Step 1 of 3 — Passenger Details',
  'Step 2 of 3 — Payment',
  'Step 3 of 3 — Confirmation',
];

/**
 * Converts a seat index to a human-readable label.
 * E.g. index 4 → "B-1"
 * @param {number} index
 * @returns {string}
 */
export function seatLabel(index) {
  const row = String.fromCharCode(65 + Math.floor(index / 4));
  const col = (index % 4) + 1;
  return `${row}-${col}`;
}

/**
 * Formats a PKR amount with locale separators.
 * @param {number} amount
 * @returns {string}  e.g. "PKR 7,350"
 */
export function formatPKR(amount) {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}
