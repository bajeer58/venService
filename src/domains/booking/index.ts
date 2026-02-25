/* ═══════════════════════════════════════════════════════════
   src/domains/index.ts — venService v2.0
   Barrel export for all domain-layer public APIs.
   ═══════════════════════════════════════════════════════════ */

// ── Auth domain ────────────────────────────────────────────
export {
    useAuthDomain,
    AuthDomainProvider,
    type AuthState,
    type AuthContextValue,
} from './auth/AuthContext';

// ── Booking domain ─────────────────────────────────────────
export {
    useBookingDomain,
    BookingDomainProvider,
    type BookingContextValue,
} from './booking/BookingContext';

export {
    bookingReducer,
    INITIAL_CONTEXT,
    canProceedToPayment,
    canConfirm,
    isConfirmed,
    type BookingMachineContext,
    type BookingEvent,
} from './booking/bookingMachine';

export {
    validatePassenger,
    validatePayment,
    calculateTotal,
    type PassengerValidationErrors,
    type PaymentValidationErrors,
    type ValidationResult,
} from './booking/paymentValidation';

export {
    useRoutes as useBookingRoutes,
    useSchedules,
    useBookingConfirmation,
} from './booking/hooks/useBookingQueries';
