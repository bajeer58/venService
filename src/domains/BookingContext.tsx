// src/domains/booking/BookingContext.tsx
// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for all booking state.
// Replaces the duplicated Context + Hook pattern.
// Components use useBookingSelector for granular subscriptions.
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
  type Dispatch,
} from 'react';
import {
  bookingReducer,
  createInitialState,
  clearDraftPersistence,
} from './bookingMachine';
import { bookingService } from './bookingService';
import type {
  BookingMachineState,
  BookingStateEvent,
  Van,
  BookingDateRange,
  PaymentDetails,
  BookingStep,
} from '../../shared/types/domain';

// ── Context shape ─────────────────────────────────────────────

interface BookingContextValue {
  state: BookingMachineState;
  dispatch: Dispatch<BookingStateEvent>;

  // Typed action creators — preferred API for components
  selectVan:      (van: Van) => void;
  setDates:       (dateRange: BookingDateRange) => void;
  setPayment:     (details: PaymentDetails) => void;
  nextStep:       () => void;
  prevStep:       () => void;
  gotoStep:       (step: BookingStep) => void;
  submitBooking:  () => Promise<void>;
  resetBooking:   () => void;

  // Derived
  canProceed: boolean;
  totalAmount: number;
}

// ── Context ───────────────────────────────────────────────────

const BookingContext = createContext<BookingContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, undefined, createInitialState);

  const selectVan = useCallback(
    (van: Van) => dispatch({ type: 'SELECT_VAN', van }),
    []
  );

  const setDates = useCallback(
    (dateRange: BookingDateRange) => dispatch({ type: 'SET_DATES', dateRange }),
    []
  );

  const setPayment = useCallback(
    (details: PaymentDetails) => dispatch({ type: 'SET_PAYMENT', details }),
    []
  );

  const nextStep = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const prevStep = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);
  const gotoStep = useCallback((step: BookingStep) => dispatch({ type: 'GOTO_STEP', step }), []);
  const resetBooking = useCallback(() => dispatch({ type: 'RESET' }), []);

  const submitBooking = useCallback(async () => {
    dispatch({ type: 'SUBMIT' });
    try {
      await bookingService.createBooking(state.draft);
      clearDraftPersistence();
      dispatch({ type: 'RESET' });
    } catch (err) {
      // In production: dispatch a SUBMIT_ERROR event to the reducer
      console.error('[BookingContext] Submission failed:', err);
    }
  }, [state.draft]);

  const canProceed = useMemo(() => {
    const { step, draft } = state;
    if (step === 1) return draft.selectedVan !== null;
    if (step === 2) return draft.dateRange !== null;
    if (step === 3) return draft.paymentDetails !== null;
    return true;
  }, [state]);

  const value = useMemo<BookingContextValue>(
    () => ({
      state,
      dispatch,
      selectVan,
      setDates,
      setPayment,
      nextStep,
      prevStep,
      gotoStep,
      submitBooking,
      resetBooking,
      canProceed,
      totalAmount: state.draft.totalAmount,
    }),
    [state, selectVan, setDates, setPayment, nextStep, prevStep, gotoStep, submitBooking, resetBooking, canProceed]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

// ── Hooks ─────────────────────────────────────────────────────

/** Full booking context — use only when you need actions AND state */
export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within <BookingProvider>');
  return ctx;
}

/**
 * Typed selector hook — components only re-render when their
 * selected slice changes. Eliminates over-rendering.
 *
 * @example
 * const van = useBookingSelector(s => s.draft.selectedVan);
 */
export function useBookingSelector<T>(
  selector: (state: BookingMachineState) => T
): T {
  const { state } = useBooking();
  return selector(state);
}

/** Lightweight hook for just actions — zero re-renders on state change */
export function useBookingActions() {
  const { selectVan, setDates, setPayment, nextStep, prevStep, gotoStep, submitBooking, resetBooking } =
    useBooking();
  return { selectVan, setDates, setPayment, nextStep, prevStep, gotoStep, submitBooking, resetBooking };
}
