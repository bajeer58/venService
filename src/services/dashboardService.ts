/* ─────────────────────────────────────────────
   Mock dashboard service — simulates admin API.
   ───────────────────────────────────────────── */

import {
  KPI_DATA, WEEKLY_BOOKINGS, ROUTE_DISTRIBUTION,
  MANIFEST_DATA, ACTIVITY_LOG,
} from '../utils/constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Fetch KPI cards data */
export async function fetchKPIs() {
  await delay(600);
  return KPI_DATA;
}

/** Fetch weekly booking chart data */
export async function fetchWeeklyBookings() {
  await delay(400);
  return WEEKLY_BOOKINGS;
}

/** Fetch route distribution for donut chart */
export async function fetchRouteDistribution() {
  await delay(500);
  return ROUTE_DISTRIBUTION;
}

/** Fetch manifest for a specific van */
export async function fetchManifest() {
  await delay(700);
  return MANIFEST_DATA;
}

/** Fetch activity log entries */
export async function fetchActivityLog() {
  await delay(500);
  return ACTIVITY_LOG;
}
