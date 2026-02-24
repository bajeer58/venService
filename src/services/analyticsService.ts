/* ─────────────────────────────────────────────
   Mock analytics service — simulates BI API.
   ───────────────────────────────────────────── */

import {
    DAILY_REVENUE, PEAK_HOURS, SEAT_OCCUPANCY, ROUTE_PROFITABILITY,
} from '../utils/constants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Fetch daily revenue for the last month */
export async function fetchDailyRevenue() {
    await delay(800);
    return DAILY_REVENUE;
}

/** Fetch peak hours booking density */
export async function fetchPeakHours() {
    await delay(600);
    return PEAK_HOURS;
}

/** Fetch seat occupancy trends */
export async function fetchSeatOccupancy() {
    await delay(500);
    return SEAT_OCCUPANCY;
}

/** Fetch route profitability metrics */
export async function fetchRouteProfitability() {
    await delay(700);
    return ROUTE_PROFITABILITY;
}
