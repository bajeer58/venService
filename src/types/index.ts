/* ─────────────────────────────────────────────
   Core type definitions for the Ven Service platform.
   Single source of truth for all shared interfaces.
   ───────────────────────────────────────────── */

/** Possible states for any seat in the van */
export type SeatStatus = 'available' | 'selected' | 'booked' | 'locked';

/** A single seat in the van layout */
export interface Seat {
  id: number;
  label: string;
  status: SeatStatus;
}

/** A bookable route between two cities */
export interface Route {
  id: string;
  from: string;
  to: string;
  price: number;
  departureTime: string;
  duration: string;
  seatsLeft: number;
  emoji: string;
  badgeColor: 'green' | 'amber' | 'red';
}

/** A completed or pending booking */
export interface Booking {
  id: string;
  passengerName: string;
  firstName: string;
  lastName: string;
  phone: string;
  cnic?: string;
  email?: string;
  route: { from: string; to: string };
  date: string;
  time: string;
  seats: string[];
  vanId: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedVia: 'online' | 'counter';
  paymentMethod: string;
}

/** KPI metric card for the admin dashboard */
export interface KpiCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: 'blue' | 'green' | 'amber' | 'text';
}

/** A single day's booking count (for charts) */
export interface WeeklyBooking {
  day: string;
  count: number;
}

/** Route distribution data for donut chart */
export interface RouteDistribution {
  name: string;
  value: number;
  color: string;
}

/** A row in the staff manifest table */
export interface ManifestRow {
  id: number;
  passenger: string;
  seat: string;
  phone: string;
  bookedVia: string;
  status: 'confirmed' | 'pending' | 'available';
}

/** An entry in the admin activity log */
export interface ActivityLogEntry {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  type: 'booking' | 'cancellation' | 'login' | 'export';
}

/** Toast notification variant */
export type ToastVariant = 'success' | 'error' | 'info';

/** Toast notification message */
export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

/** Passenger form data for the booking modal */
export interface PassengerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  cnic: string;
  email: string;
}

/** Payment form data */
export interface PaymentFormData {
  method: string;
  accountNumber: string;
}

/** Schedule option for routes */
export interface ScheduleOption {
  id: string;
  time: string;
  vanId: string;
  seatsAvailable: number;
}
