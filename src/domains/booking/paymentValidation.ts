/* ═══════════════════════════════════════════════════════════
   src/domains/booking/paymentValidation.ts — venService v2.0
   Payment and passenger form validation.
   Pure functions — no React or state dependencies.
   Uses lib utilities for Luhn check, expiry validation, etc.
   ═══════════════════════════════════════════════════════════ */

import type { PassengerDetails, PaymentDetails, PaymentMethod } from '../../shared/types/domain';
import { isValidEmail, isValidCardNumber, isCardExpired } from '../../lib';

// ── Validation result types ────────────────────────────────

export type FieldError = string | null;

export interface PassengerValidationErrors {
    firstName?: FieldError;
    lastName?: FieldError;
    email?: FieldError;
    phone?: FieldError;
    cnicLast4?: FieldError;
}

export interface PaymentValidationErrors {
    cardNumber?: FieldError;
    cardName?: FieldError;
    expiry?: FieldError;
    cvv?: FieldError;
    mobileNumber?: FieldError;
}

export interface ValidationResult<T> {
    isValid: boolean;
    errors: T;
}

// ── Passenger validation ───────────────────────────────────

export function validatePassenger(
    data: Partial<PassengerDetails>,
): ValidationResult<PassengerValidationErrors> {
    const errors: PassengerValidationErrors = {};

    if (!data.firstName?.trim()) {
        errors.firstName = 'First name is required.';
    } else if (data.firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters.';
    }

    if (!data.lastName?.trim()) {
        errors.lastName = 'Last name is required.';
    } else if (data.lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters.';
    }

    if (!data.email?.trim()) {
        errors.email = 'Email address is required.';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Enter a valid email address.';
    }

    if (!data.phone?.trim()) {
        errors.phone = 'Phone number is required.';
    } else if (!/^(\+92|0)[0-9]{10}$/.test(data.phone.replace(/\s/g, ''))) {
        errors.phone = 'Enter a valid Pakistani phone number (e.g. 03001234567).';
    }

    if (data.cnicLast4 && !/^\d{4}$/.test(data.cnicLast4)) {
        errors.cnicLast4 = 'CNIC last 4 digits must be numeric.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

// ── Card payment validation ────────────────────────────────

function validateCardPayment(
    data: Partial<PaymentDetails>,
): PaymentValidationErrors {
    const errors: PaymentValidationErrors = {};

    const raw = data.cardNumber?.replace(/\s/g, '') ?? '';
    if (!raw) {
        errors.cardNumber = 'Card number is required.';
    } else if (!isValidCardNumber(raw)) {
        errors.cardNumber = 'Enter a valid card number.';
    }

    if (!data.cardName?.trim()) {
        errors.cardName = 'Name on card is required.';
    }

    if (!data.expiry?.trim()) {
        errors.expiry = 'Expiry date is required.';
    } else if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
        errors.expiry = 'Use MM/YY format.';
    } else if (isCardExpired(data.expiry)) {
        errors.expiry = 'This card has expired.';
    }

    if (!data.cvv?.trim()) {
        errors.cvv = 'CVV is required.';
    } else if (!/^\d{3,4}$/.test(data.cvv)) {
        errors.cvv = 'CVV must be 3–4 digits.';
    }

    return errors;
}

// ── Mobile wallet validation ───────────────────────────────

function validateMobileWallet(
    data: Partial<PaymentDetails>,
): PaymentValidationErrors {
    const errors: PaymentValidationErrors = {};

    const phone = data.mobileNumber?.replace(/\s/g, '') ?? '';
    if (!phone) {
        errors.mobileNumber = 'Mobile number is required.';
    } else if (!/^(03\d{9}|\+923\d{9})$/.test(phone)) {
        errors.mobileNumber = 'Enter a valid mobile number (e.g. 03001234567).';
    }

    return errors;
}

// ── Main payment validation ────────────────────────────────

export function validatePayment(
    data: Partial<PaymentDetails>,
): ValidationResult<PaymentValidationErrors> {
    let errors: PaymentValidationErrors = {};

    const method: PaymentMethod = data.method ?? 'card';

    switch (method) {
        case 'card':
            errors = validateCardPayment(data);
            break;

        case 'easypaisa':
        case 'jazzcash':
            errors = validateMobileWallet(data);
            break;

        case 'cash':
            // No validation needed for cash
            break;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

// ── Booking total ──────────────────────────────────────────

/**
 * Calculate booking total with optional seat count.
 * Apply 5% booking fee for card payments.
 */
export function calculateTotal(
    basePrice: number,
    seatCount: number,
    method: PaymentMethod = 'cash',
): { subtotal: number; fee: number; total: number } {
    const subtotal = basePrice * Math.max(seatCount, 1);
    const fee = method === 'card' ? Math.round(subtotal * 0.05) : 0;
    return { subtotal, fee, total: subtotal + fee };
}
