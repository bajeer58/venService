/* ─────────────────────────────────────────────────────────────
   useBookingFlow.ts — venService v2.0
   State machine + validation hook for 5-step booking flow.
   ───────────────────────────────────────────────────────────── */

import { useState, useCallback } from 'react';
import type { PassengerFormData, PaymentFormData, Route } from '../../types';

// ── Types ──────────────────────────────────────────────────────

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export interface TimeSlot {
    id: string;
    time: string;
    seatsLeft: number;
    vanId: string;
}

export interface FlowState {
    step: BookingStep;
    selectedRoute: Route | null;
    selectedDate: string;
    selectedTimeSlot: TimeSlot | null;
    passenger: PassengerFormData;
    payment: PaymentFormData;
    bookingRef: string | null;
    isProcessing: boolean;
    errors: Partial<Record<keyof PassengerFormData | keyof PaymentFormData, string>>;
}

const DEFAULT_PASSENGER: PassengerFormData = {
    firstName: '',
    lastName: '',
    phone: '',
    cnic: '',
    email: '',
};

const DEFAULT_PAYMENT: PaymentFormData = {
    method: 'easypaisa',
    accountNumber: '',
};

function getTomorrow(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

// ── Validation rules ───────────────────────────────────────────

function validatePassenger(data: PassengerFormData) {
    const errors: Partial<Record<keyof PassengerFormData, string>> = {};
    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^03\d{9}$/.test(data.phone.trim())) errors.phone = 'Enter a valid PK mobile number (03xxxxxxxxx)';
    if (data.cnic && !/^\d{5}-\d{7}-\d$/.test(data.cnic.trim())) errors.cnic = 'CNIC format: 12345-1234567-1';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Enter a valid email';
    return errors;
}

function validatePayment(data: PaymentFormData) {
    const errors: Partial<Record<keyof PaymentFormData, string>> = {};
    if (!data.accountNumber.trim()) errors.accountNumber = 'Account / reference number is required';
    return errors;
}

// ── Hook ───────────────────────────────────────────────────────

export function useBookingFlow() {
    const [state, setState] = useState<FlowState>({
        step: 1,
        selectedRoute: null,
        selectedDate: getTomorrow(),
        selectedTimeSlot: null,
        passenger: DEFAULT_PASSENGER,
        payment: DEFAULT_PAYMENT,
        bookingRef: null,
        isProcessing: false,
        errors: {},
    });

    const setStep = useCallback((step: BookingStep) => {
        setState(s => ({ ...s, step, errors: {} }));
    }, []);

    const selectRoute = useCallback((route: Route) => {
        setState(s => ({ ...s, selectedRoute: route }));
    }, []);

    const setDate = useCallback((date: string) => {
        setState(s => ({ ...s, selectedDate: date, selectedTimeSlot: null }));
    }, []);

    const selectTimeSlot = useCallback((slot: TimeSlot) => {
        setState(s => ({ ...s, selectedTimeSlot: slot }));
    }, []);

    const updatePassenger = useCallback((data: Partial<PassengerFormData>) => {
        setState(s => ({
            ...s,
            passenger: { ...s.passenger, ...data },
            errors: { ...s.errors },
        }));
    }, []);

    const updatePayment = useCallback((data: Partial<PaymentFormData>) => {
        setState(s => ({
            ...s,
            payment: { ...s.payment, ...data },
            errors: { ...s.errors },
        }));
    }, []);

    /** Advance to the next step after validating current */
    const nextStep = useCallback((): boolean => {
        setState(s => {
            if (s.step === 1 && !s.selectedRoute) return { ...s, errors: {} };
            if (s.step === 2 && (!s.selectedTimeSlot)) return { ...s, errors: {} };
            if (s.step === 3) {
                const errs = validatePassenger(s.passenger);
                if (Object.keys(errs).length > 0) return { ...s, errors: errs };
            }
            if (s.step === 4) {
                const errs = validatePayment(s.payment);
                if (Object.keys(errs).length > 0) return { ...s, errors: errs };
            }
            return { ...s, step: Math.min(5, s.step + 1) as BookingStep, errors: {} };
        });
        return true;
    }, []);

    const prevStep = useCallback(() => {
        setState(s => ({ ...s, step: Math.max(1, s.step - 1) as BookingStep, errors: {} }));
    }, []);

    const canAdvanceStep1 = !!state.selectedRoute;
    const canAdvanceStep2 = !!state.selectedTimeSlot;

    /** Simulate payment processing + booking confirmation */
    const confirmBooking = useCallback(async (): Promise<string | null> => {
        const paymentErrors = validatePayment(state.payment);
        if (Object.keys(paymentErrors).length > 0) {
            setState(s => ({ ...s, errors: paymentErrors }));
            return null;
        }

        setState(s => ({ ...s, isProcessing: true }));
        await new Promise(r => setTimeout(r, 1800));

        const ref = `VS-${Date.now().toString(36).toUpperCase()}`;
        setState(s => ({ ...s, isProcessing: false, bookingRef: ref, step: 5 }));
        return ref;
    }, [state.payment]);

    const reset = useCallback(() => {
        setState({
            step: 1,
            selectedRoute: null,
            selectedDate: getTomorrow(),
            selectedTimeSlot: null,
            passenger: DEFAULT_PASSENGER,
            payment: DEFAULT_PAYMENT,
            bookingRef: null,
            isProcessing: false,
            errors: {},
        });
    }, []);

    return {
        state,
        setStep,
        selectRoute,
        setDate,
        selectTimeSlot,
        updatePassenger,
        updatePayment,
        nextStep,
        prevStep,
        confirmBooking,
        reset,
        canAdvanceStep1,
        canAdvanceStep2,
    };
}
