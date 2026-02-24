/* ─────────────────────────────────────────────
   Application constants — single source of truth.
   Import from here; never hardcode values.
   ───────────────────────────────────────────── */

import type {
  SeatStatus, Route, KpiCard, WeeklyBooking, RouteDistribution,
  ManifestRow, ActivityLogEntry,
  DailyRevenue, PeakHour, SeatOccupancy, RouteProfit,
} from '../types';

// ── Pricing ─────────────────────────────────────────────────────────────────────

export const PRICE_PER_SEAT = 3500;
export const SERVICE_FEE_RATE = 0.05; // 5%
export const SEAT_HOLD_MINUTES = 5;

// ── Seat layout ─────────────────────────────────────────────────────────────────

export const TOTAL_SEATS = 20;
export const SEATS_PER_ROW = 4;

/** Initial seat statuses for the demo van (5 rows x 4 cols) */
export const INITIAL_SEAT_STATUSES: SeatStatus[] = [
  'booked', 'available', 'available', 'available',
  'available', 'locked', 'available', 'booked',
  'available', 'available', 'booked', 'available',
  'available', 'available', 'available', 'available',
  'booked', 'available', 'available', 'locked',
];

// ── Cities & Routes ─────────────────────────────────────────────────────────────

export const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Multan', 'Quetta'];

export const POPULAR_ROUTES: Route[] = [
  { id: 'khi-isb', from: 'Karachi', to: 'Islamabad', price: 3500, departureTime: '08:00 AM', duration: '18 hrs', seatsLeft: 7, emoji: '🏙️', badgeColor: 'green' },
  { id: 'lhr-pew', from: 'Lahore', to: 'Peshawar', price: 1800, departureTime: '10:30 AM', duration: '5 hrs', seatsLeft: 3, emoji: '🕌', badgeColor: 'amber' },
  { id: 'isb-khi', from: 'Islamabad', to: 'Karachi', price: 3500, departureTime: '06:00 PM', duration: '18 hrs', seatsLeft: 12, emoji: '🏔️', badgeColor: 'green' },
  { id: 'pew-lhr', from: 'Peshawar', to: 'Lahore', price: 1800, departureTime: '07:00 AM', duration: '5 hrs', seatsLeft: 0, emoji: '🏛️', badgeColor: 'red' },
  { id: 'mul-lhr', from: 'Multan', to: 'Lahore', price: 1200, departureTime: '09:00 AM', duration: '4 hrs', seatsLeft: 9, emoji: '🌾', badgeColor: 'green' },
  { id: 'qta-khi', from: 'Quetta', to: 'Karachi', price: 2200, departureTime: '11:00 PM', duration: '10 hrs', seatsLeft: 5, emoji: '⛰️', badgeColor: 'amber' },
];

export const QUICK_ROUTES = [
  { from: 'Karachi', to: 'Islamabad' },
  { from: 'Lahore', to: 'Peshawar' },
  { from: 'Multan', to: 'Lahore' },
  { from: 'Islamabad', to: 'Karachi' },
];

// ── Dashboard KPIs ──────────────────────────────────────────────────────────────

export const KPI_DATA: KpiCard[] = [
  { label: 'Total Revenue', value: '₨2.4M', change: '+18% this month', trend: 'up', color: 'blue' },
  { label: 'Bookings Today', value: '347', change: '+42 vs yesterday', trend: 'up', color: 'green' },
  { label: 'Seat Occupancy', value: '84%', change: '-3% this week', trend: 'down', color: 'amber' },
  { label: 'Active Vans', value: '38', change: '2 new vans added', trend: 'up', color: 'text' },
];

export const WEEKLY_BOOKINGS: WeeklyBooking[] = [
  { day: 'Mon', count: 82 },
  { day: 'Tue', count: 124 },
  { day: 'Wed', count: 98 },
  { day: 'Thu', count: 156 },
  { day: 'Fri', count: 210 },
  { day: 'Sat', count: 189 },
  { day: 'Sun', count: 347 },
];

export const ROUTE_DISTRIBUTION: RouteDistribution[] = [
  { name: 'KHI–ISB', value: 45, color: '#1a6bff' },
  { name: 'LHR–PEW', value: 27, color: '#00d68f' },
  { name: 'MUL–LHR', value: 16, color: '#f5a623' },
  { name: 'Others', value: 12, color: '#ff4757' },
];

// ── Staff Manifest ──────────────────────────────────────────────────────────────

export const MANIFEST_DATA: ManifestRow[] = [
  { id: 1, passenger: 'Ali Hassan', seat: 'A-1', phone: '0300-1234567', bookedVia: 'Online', status: 'confirmed' },
  { id: 2, passenger: 'Sana Malik', seat: 'A-2', phone: '0311-9876543', bookedVia: 'Counter', status: 'confirmed' },
  { id: 3, passenger: 'Ibrahim Khan', seat: 'A-3', phone: '0333-5556667', bookedVia: 'Online', status: 'pending' },
  { id: 4, passenger: 'Farah Naz', seat: 'B-1', phone: '0345-1112223', bookedVia: 'Counter', status: 'confirmed' },
  { id: 5, passenger: '—', seat: 'B-2', phone: '—', bookedVia: '—', status: 'available' },
];

// ── Activity Log ────────────────────────────────────────────────────────────────

export const ACTIVITY_LOG: ActivityLogEntry[] = [
  { id: 1, action: 'Booked 2 seats on KHI-ISB', user: 'Ali Hassan', timestamp: '2 min ago', type: 'booking' },
  { id: 2, action: 'Cancelled booking #VS-00844', user: 'System', timestamp: '15 min ago', type: 'cancellation' },
  { id: 3, action: 'Exported daily manifest PDF', user: 'Staff: Usman', timestamp: '32 min ago', type: 'export' },
  { id: 4, action: 'Staff login from Lahore counter', user: 'Staff: Ayesha', timestamp: '1 hr ago', type: 'login' },
  { id: 5, action: 'Added Van #KI-12 to fleet', user: 'Admin', timestamp: '2 hrs ago', type: 'booking' },
  { id: 6, action: 'Revenue report generated', user: 'System', timestamp: '3 hrs ago', type: 'export' },
];

// ── Booking Modal ───────────────────────────────────────────────────────────────

export const MODAL_STEPS = [
  'Step 1 of 3 — Passenger Details',
  'Step 2 of 3 — Payment',
  'Step 3 of 3 — Confirmation',
];

export const PAYMENT_METHODS = [
  { value: 'easypaisa', label: '💳 Easypaisa' },
  { value: 'jazzcash', label: '📱 JazzCash' },
  { value: 'bank', label: '🏦 Bank Transfer' },
  { value: 'cash', label: '💵 Cash at Counter' },
];

// ── Landing Page Content ────────────────────────────────────────────────────────

export const FEATURES = [
  { icon: '⚡', title: 'Real-Time Seat Locking', desc: 'WebSocket-powered seat locks prevent double bookings. 5-minute hold timer with automatic release.' },
  { icon: '📱', title: 'QR E-Tickets', desc: 'Tamper-proof QR tickets sent via SMS and email. Scannable offline. Full audit trail per ticket.' },
  { icon: '🖨️', title: 'Thermal Printing', desc: 'ESC/POS thermal printer support for 58mm slips. One-click print from any browser.' },
  { icon: '📊', title: 'Revenue Analytics', desc: 'Daily, weekly, and monthly revenue charts. Route performance, occupancy rates, and export tools.' },
  { icon: '🔒', title: 'Role-Based Access', desc: 'Passenger, Staff, and Admin roles with JWT authentication. Each role sees only what they need.' },
  { icon: '🗺️', title: 'SEO-Optimized Routes', desc: 'Clean /book/karachi-islamabad URLs with JSON-LD schema. SSR-ready for full search engine indexing.' },
];

export const HOW_IT_WORKS = [
  { num: '01', icon: '🔍', title: 'Search Routes', desc: 'Enter your departure city, destination, and travel date to find available vans.' },
  { num: '02', icon: '💺', title: 'Select Seats', desc: "View the real-time seat map and pick your preferred seats. They're held for 5 minutes." },
  { num: '03', icon: '💳', title: 'Pay Securely', desc: 'Pay via Easypaisa, JazzCash, bank transfer, or cash at any partner counter.' },
  { num: '04', icon: '📱', title: 'Show QR Ticket', desc: 'Receive your e-ticket instantly. Show the QR code at boarding — no printing needed.' },
];

export const HERO_STATS = [
  { value: '24', suffix: 'K+', label: 'Monthly Passengers' },
  { value: '180', suffix: '+', label: 'Daily Departures' },
  { value: '99', suffix: '.8%', label: 'Uptime SLA' },
  { value: '42', suffix: 's', label: 'Avg. Booking Time' },
];

// ── Route Schedule Options (for staff panel) ────────────────────────────────────

export const SCHEDULE_OPTIONS = [
  { id: 'ki07-08', time: '08:00 AM', vanId: 'KI-07', seatsAvailable: 7 },
  { id: 'ki09-14', time: '02:00 PM', vanId: 'KI-09', seatsAvailable: 12 },
];
// ── BI Analytics Data ───────────────────────────────────────────────────────────

export const DAILY_REVENUE: DailyRevenue[] = [
  { date: '2026-02-01', revenue: 45000 },
  { date: '2026-02-02', revenue: 52000 },
  { date: '2026-02-03', revenue: 48000 },
  { date: '2026-02-04', revenue: 61000 },
  { date: '2026-02-05', revenue: 55000 },
  { date: '2026-02-06', revenue: 72000 },
  { date: '2026-02-07', revenue: 86000 },
  { date: '2026-02-08', revenue: 95000 },
  { date: '2026-02-09', revenue: 68000 },
  { date: '2026-02-10', revenue: 59000 },
  { date: '2026-02-11', revenue: 63000 },
  { date: '2026-02-12', revenue: 77000 },
  { date: '2026-02-13', revenue: 82000 },
  { date: '2026-02-14', revenue: 110000 },
  { date: '2026-02-15', revenue: 125000 },
  { date: '2026-02-16', revenue: 88000 },
  { date: '2026-02-17', revenue: 74000 },
  { date: '2026-02-18', revenue: 79000 },
  { date: '2026-02-19', revenue: 91000 },
  { date: '2026-02-20', revenue: 105000 },
  { date: '2026-02-21', revenue: 118000 },
  { date: '2026-02-22', revenue: 132000 },
  { date: '2026-02-23', revenue: 98000 },
  { date: '2026-02-24', revenue: 102000 },
];

export const PEAK_HOURS: PeakHour[] = [
  { hour: '06 AM', count: 45 },
  { hour: '08 AM', count: 120 },
  { hour: '10 AM', count: 85 },
  { hour: '12 PM', count: 60 },
  { hour: '02 PM', count: 75 },
  { hour: '04 PM', count: 110 },
  { hour: '06 PM', count: 145 },
  { hour: '08 PM', count: 95 },
  { hour: '10 PM', count: 50 },
  { hour: '12 AM', count: 25 },
];

export const SEAT_OCCUPANCY: SeatOccupancy[] = [
  { category: 'Weekdays', occupancy: 78 },
  { category: 'Weekends', occupancy: 94 },
  { category: 'Holidays', occupancy: 98 },
  { category: 'Overall', occupancy: 84 },
];

export const ROUTE_PROFITABILITY: RouteProfit[] = [
  { route: 'KHI-ISB', revenue: 850000, cost: 520000, profit: 330000 },
  { route: 'LHR-PEW', revenue: 420000, cost: 280000, profit: 140000 },
  { route: 'ISB-KHI', revenue: 790000, cost: 510000, profit: 280000 },
  { route: 'MUL-LHR', revenue: 180000, cost: 110000, profit: 70000 },
  { route: 'QTA-KHI', revenue: 260000, cost: 190000, profit: 70000 },
];
