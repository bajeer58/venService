/* ═══════════════════════════════════════════════════════════
   src/domains/booking/BookingContext.tsx — venService v2.0
   Domain-layer booking context powered by bookingMachine.ts.
   Exposes dispatch + derived selectors to the UI layer.
   ═══════════════════════════════════════════════════════════ */

import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import {
    bookingReducer,
    INITIAL_CONTEXT,
    canProceedToPayment,
    canConfirm,
    isConfirmed,
    type BookingMachineContext,
    type BookingEvent,
} from './bookingMachine';
import type { ServiceRoute, Schedule, Seat, PassengerDetails, PaymentDetails } from '../../shared/types/domain';

// ── Context value shape ─────────────────────────────────────

export interface BookingContextValue {
    // Raw state
    state: BookingMachineContext;

    // Dispatch
    dispatch: React.Dispatch<BookingEvent>;

    // Action helpers (typed wrappers around dispatch)
    selectRoute: (route: ServiceRoute) => void;
    selectSchedule: (schedule: Schedule) => void;
    toggleSeat: (seat: Seat) => void;
    setPassenger: (passenger: PassengerDetails) => void;
    setPayment: (payment: PaymentDetails) => void;
    confirm: () => void;
    cancel: () => void;
    goBack: () => void;
    reset: () => void;
    setError: (error: string) => void;
    clearError: () => void;

    // Derived / guard selectors
    canProceedToPayment: boolean;
    canConfirm: boolean;
    isConfirmed: boolean;
    stepIndex: number;
    totalSteps: number;
}

// ── Context ────────────────────────────────────────────────

const BookingDomainContext = createContext<BookingContextValue | null>(null);
BookingDomainContext.displayName = 'BookingDomainContext';

// ── Hook ────────────────────────────────────────────────────

export function useBookingDomain(): BookingContextValue {
    const ctx = useContext(BookingDomainContext);
    if (!ctx) throw new Error('useBookingDomain must be used within <BookingDomainProvider>');
    return ctx;
}

// ── Step index map ──────────────────────────────────────────

const STEP_INDEX: Record<string, number> = {
    'idle': 0,
    'selecting-route': 1,
    'selecting-datetime': 2,
    'passenger-details': 3,
    'payment': 4,
    'confirmed': 5,
    'cancelled': 0,
};
const TOTAL_STEPS = 5;

// ── Provider ────────────────────────────────────────────────

export const BookingDomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, INITIAL_CONTEXT);

    // ── Action helpers ─────────────────────────────────────
    const selectRoute = useCallback((route: ServiceRoute) => dispatch({ type: 'SELECT_ROUTE', route }), []);
    const selectSchedule = useCallback((schedule: Schedule) => dispatch({ type: 'SELECT_SCHEDULE', schedule }), []);

    const toggleSeat = useCallback((seat: Seat) => {
        const isSelected = state.selectedSeats.some(s => s.id === seat.id);
        dispatch(isSelected
            ? { type: 'DESELECT_SEAT', seatId: seat.id }
            : { type: 'SELECT_SEAT', seat },
        );
    }, [state.selectedSeats]);

    const setPassenger = useCallback((passenger: PassengerDetails) => dispatch({ type: 'SET_PASSENGER', passenger }), []);
    const setPayment = useCallback((payment: PaymentDetails) => dispatch({ type: 'SET_PAYMENT', payment }), []);
    const confirm = useCallback(() => dispatch({ type: 'CONFIRM' }), []);
    const cancel = useCallback(() => dispatch({ type: 'CANCEL' }), []);
    const goBack = useCallback(() => dispatch({ type: 'BACK' }), []);
    const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
    const setError = useCallback((error: string) => dispatch({ type: 'SET_ERROR', error }), []);
    const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

    const value: BookingContextValue = {
        state,
        dispatch,
        selectRoute,
        selectSchedule,
        toggleSeat,
        setPassenger,
        setPayment,
        confirm,
        cancel,
        goBack,
        reset,
        setError,
        clearError,
        canProceedToPayment: canProceedToPayment(state),
        canConfirm: canConfirm(state),
        isConfirmed: isConfirmed(state),
        stepIndex: STEP_INDEX[state.step] ?? 0,
        totalSteps: TOTAL_STEPS,
    };

    return (
        <BookingDomainContext.Provider value={value}>
            {children}
        </BookingDomainContext.Provider>
    );
};
