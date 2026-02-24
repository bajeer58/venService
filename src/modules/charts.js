/**
 * charts.js
 * Renders the admin analytics bar chart.
 * Purely DOM-based — no external chart library required.
 */

import { WEEKLY_BOOKINGS } from '../config/config.js';

/**
 * Build the weekly bookings bar chart inside #barChart.
 * Each column scales proportionally to the highest count.
 */
export function renderBarChart() {
  const container = document.getElementById('barChart');
  if (!container) return;

  const maxCount = Math.max(...WEEKLY_BOOKINGS.map(d => d.count));

  container.innerHTML = '';

  WEEKLY_BOOKINGS.forEach(({ day, count }) => {
    const heightPct = Math.round((count / maxCount) * 100);

    const col = document.createElement('div');
    col.className = 'bar-col';
    col.setAttribute('title', `${day}: ${count} bookings`);

    col.innerHTML = `
      <div class="bar" style="height:${heightPct}%"></div>
      <div class="bar-lbl">${day}</div>
    `;

    container.appendChild(col);
  });
}
