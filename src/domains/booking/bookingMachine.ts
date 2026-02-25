/* ═══════════════════════════════════════════════════════════
   src/domains/booking/bookingMachine.ts — venService v2.0
   XState-style booking state machine (without XState dep).
   Manages the 5-step booking flow as an explicit state graph.
   ═══════════════════════════════════════════════════════════ */

import type { BookingStatus, ServiceRoute, Schedule, Seat, PassengerDetails, PaymentDetails } from '../../shared/types/domain';

// ── Machine state ──────────────────────────────────────────

export interface BookingMachineContext {
    step: BookingStatus;
    selectedRoute: ServiceRoute | null;
    selectedSchedule: Schedule | null;
    selectedSeats: Seat[];
    passenger: PassengerDetails | null;
    payment: PaymentDetails | null;
    totalAmount: number;
    confirmationId: string | null;
    error: string | null;
}

export const INITIAL_CONTEXT: BookingMachineContext = {
    step: 'idle',
    selectedRoute: null,
    selectedSchedule: null,
    selectedSeats: [],
    passenger: null,
    payment: null,
    totalAmount: 0,
    confirmationId: null,
    error: null,
};

// ── Events ─────────────────────────────────────────────────

export type BookingEvent =
    | { type: 'SELECT_ROUTE'; route: ServiceRoute }
    | { type: 'SELECT_SCHEDULE'; schedule: Schedule }
    | { type: 'SELECT_SEAT'; seat: Seat }
    | { type: 'DESELECT_SEAT'; seatId: string }
    | { type: 'SET_PASSENGER'; passenger: PassengerDetails }
    | { type: 'SET_PAYMENT'; payment: PaymentDetails }
    | { type: 'CONFIRM' }
    | { type: 'CANCEL' }
    | { type: 'RESET' }
    | { type: 'SET_ERROR'; error: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'BACK' };

// ── Step order (for BACK navigation) ──────────────────────

const STEP_ORDER: BookingStatus[] = [
    'idle',
    'selecting-route',
    'selecting-datetime',
    'passenger-details',
    'payment',
    'confirmed',
];

function prevStep(current: BookingStatus): BookingStatus {
    const idx = STEP_ORDER.indexOf(current);
    return idx > 0 ? STEP_ORDER[idx - 1] : 'idle';
}

// ── Reducer ────────────────────────────────────────────────

export function bookingReducer(
    ctx: BookingMachineContext,
    event: BookingEvent,
): BookingMachineContext {
    switch (event.type) {

        case 'SELECT_ROUTE':
            return {
                ...ctx,
                step: 'selecting-datetime',
                selectedRoute: event.route,
                error: null,
            };

        case 'SELECT_SCHEDULE':
            return {
                ...ctx,
                step: 'passenger-details',
                selectedSchedule: event.schedule,
                totalAmount: ctx.selectedRoute?.basePrice ?? 0,
                error: null,
            };

        case 'SELECT_SEAT': {
            const already = ctx.selectedSeats.find(s => s.id === event.seat.id);
            if (already) return ctx;
            return {
                ...ctx,
                selectedSeats: [...ctx.selectedSeats, event.seat],
                totalAmount:
                    (ctx.selectedRoute?.basePrice ?? 0) *
                    (ctx.selectedSeats.length + 1),
            };
        }

        case 'DESELECT_SEAT':
            return {
                ...ctx,
                selectedSeats: ctx.selectedSeats.filter(s => s.id !== event.seatId),
                totalAmount:
                    (ctx.selectedRoute?.basePrice ?? 0) *
                    Math.max(ctx.selectedSeats.length - 1, 0),
            };

        case 'SET_PASSENGER':
            return {
                ...ctx,
                step: 'payment',
                passenger: event.passenger,
                error: null,
            };

        case 'SET_PAYMENT':
            return {
                ...ctx,
                payment: event.payment,
                error: null,
            };

        case 'CONFIRM':
            if (ctx.step !== 'payment') return ctx;
            return {
                ...ctx,
                step: 'confirmed',
                confirmationId: `VEN-${Date.now().toString(36).toUpperCase()}`,
                error: null,
            };

        case 'CANCEL':
            return { ...ctx, step: 'cancelled', error: null };

        case 'RESET':
            return INITIAL_CONTEXT;

        case 'BACK':
            return { ...ctx, step: prevStep(ctx.step), error: null };

        case 'SET_ERROR':
            return { ...ctx, error: event.error };

        case 'CLEAR_ERROR':
            return { ...ctx, error: null };

        default:
            return ctx;
    }
}

// ── Guard helpers ──────────────────────────────────────────

/** Can user proceed from passenger-details to payment? */
export function canProceedToPayment(ctx: BookingMachineContext): boolean {
    return (
        !!ctx.selectedRoute &&
        !!ctx.selectedSchedule &&
        !!ctx.passenger &&
        ctx.selectedSeats.length > 0
    );
}

/** Can user confirm (submit payment)? */
export function canConfirm(ctx: BookingMachineContext): boolean {
    return canProceedToPayment(ctx) && !!ctx.payment;
}

/** Is booking complete and confirmed? */
export function isConfirmed(ctx: BookingMachineContext): boolean {
    return ctx.step === 'confirmed' && !!ctx.confirmationId;
}
