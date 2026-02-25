// src/domains/booking/bookingMachine.ts
// ─────────────────────────────────────────────────────────────
// Finite State Machine for the booking flow.
// All step transitions are explicit, guarded, and testable.
// Persists draft to sessionStorage so users survive page refresh.
// ─────────────────────────────────────────────────────────────

import type {
  BookingMachineState,
  BookingStateEvent,
  BookingDraft,
  BookingStep,
  Van,
  BookingDateRange,
  PaymentDetails,
} from '../../shared/types/domain';

// ── Persistence ───────────────────────────────────────────────

const STORAGE_KEY = 'venservice:booking_draft';

function persistDraft(draft: BookingDraft): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // sessionStorage not available (private browsing / quota exceeded) — fail silently
  }
}

function hydrateDraft(): BookingDraft | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookingDraft) : null;
  } catch {
    return null;
  }
}

export function clearDraftPersistence(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch { /* no-op */ }
}

// ── Initial State ─────────────────────────────────────────────

const emptyDraft: BookingDraft = {
  selectedVan:    null,
  dateRange:      null,
  paymentMethod:  null,
  paymentDetails: null,
  totalAmount:    0,
};

export function createInitialState(): BookingMachineState {
  const persistedDraft = hydrateDraft();
  return {
    step:             1,
    draft:            persistedDraft ?? emptyDraft,
    isSubmitting:     false,
    submitError:      null,
    validationErrors: {},
  };
}

// ── Step Guards ───────────────────────────────────────────────
// Each guard returns null (OK) or an error map if the step is not complete.

type ValidationErrors = Record<string, string>;

function validateStep1(draft: BookingDraft): ValidationErrors | null {
  if (!draft.selectedVan) return { van: 'Please select a van to continue.' };
  return null;
}

function validateStep2(draft: BookingDraft): ValidationErrors | null {
  if (!draft.dateRange) return { dates: 'Please select your rental dates.' };
  const { startDate, endDate, days } = draft.dateRange;
  if (!startDate || !endDate) return { dates: 'Start and end dates are required.' };
  if (days < 1) return { dates: 'Rental must be at least 1 day.' };
  if (new Date(startDate) < new Date(new Date().toDateString()))
    return { dates: 'Start date cannot be in the past.' };
  return null;
}

function validateStep3(draft: BookingDraft): ValidationErrors | null {
  if (!draft.paymentDetails) return { payment: 'Please enter payment details.' };
  return null; // Zod schema validation runs separately in the UI layer
}

const STEP_VALIDATORS: Record<BookingStep, (d: BookingDraft) => ValidationErrors | null> = {
  1: validateStep1,
  2: validateStep2,
  3: validateStep3,
  4: () => null, // Confirmation step — no further validation
};

// ── Transition Guard ──────────────────────────────────────────

function canAdvanceFromStep(
  step: BookingStep,
  draft: BookingDraft
): ValidationErrors | null {
  const validate = STEP_VALIDATORS[step];
  return validate ? validate(draft) : null;
}

// ── Computed values ───────────────────────────────────────────

function computeTotal(van: Van | null, dateRange: BookingDateRange | null): number {
  if (!van || !dateRange) return 0;
  return van.pricePerDay * dateRange.days;
}

// ── Reducer ───────────────────────────────────────────────────

export function bookingReducer(
  state: BookingMachineState,
  event: BookingStateEvent
): BookingMachineState {
  switch (event.type) {
    case 'SELECT_VAN': {
      const draft: BookingDraft = {
        ...state.draft,
        selectedVan: event.van,
        totalAmount: computeTotal(event.van, state.draft.dateRange),
      };
      persistDraft(draft);
      // Auto-advance to step 2
      return {
        ...state,
        step:             2,
        draft,
        validationErrors: {},
      };
    }

    case 'SET_DATES': {
      const draft: BookingDraft = {
        ...state.draft,
        dateRange: event.dateRange,
        totalAmount: computeTotal(state.draft.selectedVan, event.dateRange),
      };
      persistDraft(draft);
      return {
        ...state,
        draft,
        validationErrors: {},
      };
    }

    case 'SET_PAYMENT': {
      const draft: BookingDraft = {
        ...state.draft,
        paymentMethod:  event.details.method,
        paymentDetails: event.details,
      };
      persistDraft(draft);
      return {
        ...state,
        draft,
        validationErrors: {},
      };
    }

    case 'NEXT_STEP': {
      const errors = canAdvanceFromStep(state.step, state.draft);
      if (errors) {
        return { ...state, validationErrors: errors };
      }
      const nextStep = Math.min(state.step + 1, 4) as BookingStep;
      return {
        ...state,
        step:             nextStep,
        validationErrors: {},
      };
    }

    case 'PREV_STEP': {
      const prevStep = Math.max(state.step - 1, 1) as BookingStep;
      return {
        ...state,
        step:             prevStep,
        validationErrors: {},
      };
    }

    case 'GOTO_STEP': {
      // Only allow going back — never skip ahead without validation
      if (event.step > state.step) {
        const errors = canAdvanceFromStep(state.step, state.draft);
        if (errors) return { ...state, validationErrors: errors };
      }
      return {
        ...state,
        step:             event.step,
        validationErrors: {},
      };
    }

    case 'SUBMIT': {
      return { ...state, isSubmitting: true, submitError: null };
    }

    case 'RESET': {
      clearDraftPersistence();
      return createInitialState();
    }

    default:
      return state;
  }
}
