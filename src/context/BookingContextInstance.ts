import { createContext, useContext } from 'react';
import type { Seat, PassengerFormData, PaymentFormData, Booking } from '../types';

export interface BookingState {
    seats: Seat[];
    selectedSeatIds: Set<number>;
    fromCity: string;
    toCity: string;
    travelDate: string;
    vanId: string;
    departureTime: string;
    modalOpen: boolean;
    modalStep: number;
    passengerData: PassengerFormData;
    paymentData: PaymentFormData;
    confirmedBooking: Booking | null;
    isProcessing: boolean;
}

export interface BookingContextValue {
    state: BookingState;
    pricing: { subtotal: number; serviceFee: number; total: number };
    selectedSeatLabels: string[];
    toggleSeat: (id: number) => void;
    setRoute: (from: string, to: string) => void;
    setDate: (date: string) => void;
    openModal: () => void;
    closeModal: () => void;
    setModalStep: (step: number) => void;
    setPassengerData: (data: PassengerFormData) => void;
    setPaymentData: (data: PaymentFormData) => void;
    setProcessing: (value: boolean) => void;
    confirmBooking: (booking: Booking) => void;
    resetBooking: () => void;
}

export const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error('useBooking must be used within BookingProvider');
    return ctx;
}
