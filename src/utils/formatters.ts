/* ─────────────────────────────────────────────
   Formatting utilities for display values.
   ───────────────────────────────────────────── */

import { SEATS_PER_ROW } from './constants';

/**
 * Convert a seat index (0-based) to a human-readable label.
 * Row A = index 0-3, Row B = 4-7, etc.
 * E.g. index 5 → "B-2"
 */
export function seatLabel(index: number): string {
  const row = String.fromCharCode(65 + Math.floor(index / SEATS_PER_ROW));
  const col = (index % SEATS_PER_ROW) + 1;
  return `${row}-${col}`;
}

/**
 * Format a number as PKR currency with locale separators.
 * E.g. 7350 → "PKR 7,350"
 */
export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

/**
 * Generate a random ticket ID in the format VS-XXXXX.
 */
export function generateTicketId(): string {
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `VS-${num}`;
}

/**
 * Get tomorrow's date as a YYYY-MM-DD string (for date input defaults).
 */
export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Format a date string to a human-readable display.
 * E.g. "2025-02-26" → "26 Feb 2025"
 */
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
