/* ─────────────────────────────────────────────
   Mock booking service — simulates API calls.
   Replace with real API endpoints in production.
   ───────────────────────────────────────────── */

import type { Booking, PassengerFormData, PaymentFormData } from '../types';
import { generateTicketId } from '../utils/formatters';

/** Simulate network latency */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create a new booking (mock).
 * Simulates a 1.2s API call, then returns a confirmed booking.
 */
export async function createBooking(
  passenger: PassengerFormData,
  payment: PaymentFormData,
  seats: string[],
  route: { from: string; to: string },
  date: string,
  time: string,
  vanId: string,
  subtotal: number,
  serviceFee: number,
  total: number,
): Promise<Booking> {
  await delay(1200);

  return {
    id: generateTicketId(),
    passengerName: `${passenger.firstName} ${passenger.lastName}`,
    firstName: passenger.firstName,
    lastName: passenger.lastName,
    phone: passenger.phone,
    cnic: passenger.cnic || undefined,
    email: passenger.email || undefined,
    route,
    date,
    time,
    seats,
    vanId,
    subtotal,
    serviceFee,
    total,
    status: 'confirmed',
    bookedVia: 'online',
    paymentMethod: payment.method,
  };
}

/**
 * Verify a ticket by ID (mock).
 * Returns one of three states: valid, invalid, or used.
 */
export async function verifyTicket(ticketId: string): Promise<{
  status: 'valid' | 'invalid' | 'used';
  booking?: Partial<Booking>;
}> {
  await delay(800);

  // Simulate different results based on ticket ID
  if (ticketId.endsWith('7')) {
    return {
      status: 'valid',
      booking: {
        id: ticketId,
        passengerName: 'Ali Hassan',
        seats: ['A-4'],
        route: { from: 'Karachi', to: 'Islamabad' },
      },
    };
  }
  if (ticketId.endsWith('5')) {
    return { status: 'used' };
  }
  return { status: 'invalid' };
}

/**
 * Export manifest data as CSV string (mock).
 */
export function exportManifestCSV(
  rows: Array<{ passenger: string; seat: string; phone: string; bookedVia: string; status: string }>,
): string {
  const header = '#,Passenger,Seat,Phone,Booked Via,Status';
  const lines = rows.map((r, i) =>
    `${i + 1},${r.passenger},${r.seat},${r.phone},${r.bookedVia},${r.status}`
  );
  return [header, ...lines].join('\n');
}
