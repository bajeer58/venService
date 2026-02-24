import {
  useReducer, useCallback,
  type ReactNode,
} from 'react';
import type { Booking, Seat, PassengerFormData, PaymentFormData } from '../types';
import {
  INITIAL_SEAT_STATUSES, PRICE_PER_SEAT, SERVICE_FEE_RATE,
} from '../utils/constants';
import { seatLabel } from '../utils/formatters';
import { BookingContext, type BookingState } from './BookingContextInstance';

// ── Actions ──────────────────────────────────────────────────────────────────────

type Action =
  | { type: 'TOGGLE_SEAT'; seatId: number }
  | { type: 'SET_ROUTE'; from: string; to: string }
  | { type: 'SET_DATE'; date: string }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_MODAL_STEP'; step: number }
  | { type: 'SET_PASSENGER_DATA'; data: PassengerFormData }
  | { type: 'SET_PAYMENT_DATA'; data: PaymentFormData }
  | { type: 'SET_PROCESSING'; value: boolean }
  | { type: 'CONFIRM_BOOKING'; booking: Booking }
  | { type: 'RESET_BOOKING' };

// ── Initial state ────────────────────────────────────────────────────────────────

function buildInitialSeats(): Seat[] {
  return INITIAL_SEAT_STATUSES.map((status, i) => ({
    id: i,
    label: seatLabel(i),
    status,
  }));
}

/** Get tomorrow as YYYY-MM-DD */
function getDefaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

const initialState: BookingState = {
  seats: buildInitialSeats(),
  selectedSeatIds: new Set<number>(),
  fromCity: 'Karachi',
  toCity: 'Islamabad',
  travelDate: getDefaultDate(),
  vanId: 'KI-07',
  departureTime: '08:00 AM',
  modalOpen: false,
  modalStep: 1,
  passengerData: { firstName: '', lastName: '', phone: '', cnic: '', email: '' },
  paymentData: { method: 'easypaisa', accountNumber: '' },
  confirmedBooking: null,
  isProcessing: false,
};

// ── Reducer ──────────────────────────────────────────────────────────────────────

function bookingReducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case 'TOGGLE_SEAT': {
      const seat = state.seats[action.seatId];
      if (!seat || (seat.status !== 'available' && seat.status !== 'selected')) return state;

      const newSeats = [...state.seats];
      const newSelected = new Set(state.selectedSeatIds);

      if (seat.status === 'available') {
        newSeats[action.seatId] = { ...seat, status: 'selected' };
        newSelected.add(action.seatId);
      } else {
        newSeats[action.seatId] = { ...seat, status: 'available' };
        newSelected.delete(action.seatId);
      }

      return { ...state, seats: newSeats, selectedSeatIds: newSelected };
    }

    case 'SET_ROUTE':
      return { ...state, fromCity: action.from, toCity: action.to };

    case 'SET_DATE':
      return { ...state, travelDate: action.date };

    case 'OPEN_MODAL':
      return { ...state, modalOpen: true, modalStep: 1 };

    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false, modalStep: 1 };

    case 'SET_MODAL_STEP':
      return { ...state, modalStep: action.step };

    case 'SET_PASSENGER_DATA':
      return { ...state, passengerData: action.data };

    case 'SET_PAYMENT_DATA':
      return { ...state, paymentData: action.data };

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.value };

    case 'CONFIRM_BOOKING':
      return {
        ...state,
        confirmedBooking: action.booking,
        isProcessing: false,
        modalStep: 3,
      };

    case 'RESET_BOOKING':
      return {
        ...initialState,
        seats: buildInitialSeats(),
        selectedSeatIds: new Set<number>(),
      };

    default:
      return state;
  }
}

// ── Derived values ───────────────────────────────────────────────────────────────

function computePricing(selectedCount: number) {
  const subtotal = selectedCount * PRICE_PER_SEAT;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;
  return { subtotal, serviceFee, total };
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const pricing = computePricing(state.selectedSeatIds.size);
  const selectedSeatLabels = Array.from(state.selectedSeatIds)
    .sort((a, b) => a - b)
    .map(id => seatLabel(id));

  const toggleSeat = useCallback((id: number) => dispatch({ type: 'TOGGLE_SEAT', seatId: id }), []);
  const setRoute = useCallback((from: string, to: string) => dispatch({ type: 'SET_ROUTE', from, to }), []);
  const setDate = useCallback((date: string) => dispatch({ type: 'SET_DATE', date }), []);
  const openModal = useCallback(() => dispatch({ type: 'OPEN_MODAL' }), []);
  const closeModal = useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), []);
  const setModalStep = useCallback((step: number) => dispatch({ type: 'SET_MODAL_STEP', step }), []);
  const setPassengerData = useCallback((data: PassengerFormData) => dispatch({ type: 'SET_PASSENGER_DATA', data }), []);
  const setPaymentData = useCallback((data: PaymentFormData) => dispatch({ type: 'SET_PAYMENT_DATA', data }), []);
  const setProcessing = useCallback((value: boolean) => dispatch({ type: 'SET_PROCESSING', value }), []);
  const confirmBooking = useCallback((booking: Booking) => dispatch({ type: 'CONFIRM_BOOKING', booking }), []);
  const resetBooking = useCallback(() => dispatch({ type: 'RESET_BOOKING' }), []);
  return (
    <BookingContext.Provider value={{
      state, pricing, selectedSeatLabels,
      toggleSeat, setRoute, setDate,
      openModal, closeModal, setModalStep,
      setPassengerData, setPaymentData,
      setProcessing, confirmBooking, resetBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}
