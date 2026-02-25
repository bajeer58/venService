// src/domains/booking/paymentValidation.ts
// ─────────────────────────────────────────────────────────────
// Production payment validation with Zod.
// Returns typed error maps for UI rendering — never throws raw errors.
// ─────────────────────────────────────────────────────────────

import { z } from 'zod';
import type { PaymentDetails, PaymentMethod } from '../../shared/types/domain';

// ── Regex Constants ───────────────────────────────────────────

/** Pakistan mobile numbers: 03XX-XXXXXXX or +923XXXXXXXXX */
const PK_MOBILE_REGEX = /^(\+92|0092|0)?(3[0-9]{2})[0-9]{7}$/;

/** Basic IBAN: 2-letter country + 2 check digits + up to 30 alphanumeric */
const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;

/** PK IBAN: PK + 2 digits + 4 alpha (bank code) + 16 digits */
const PK_IBAN_REGEX = /^PK[0-9]{2}[A-Z]{4}[0-9]{16}$/;

/** Luhn check for card numbers */
function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, '').split('').map(Number);
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

/** MM/YY format, not expired */
function isValidExpiry(expiry: string): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
  if (!match) return false;
  const [, month, year] = match;
  const exp = new Date(2000 + Number(year), Number(month) - 1, 1);
  return exp > new Date();
}

// ── Schemas ───────────────────────────────────────────────────

export const cardSchema = z.object({
  method:     z.literal('card'),
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .transform(v => v.replace(/\s/g, ''))
    .refine(v => /^\d{13,19}$/.test(v), 'Invalid card number')
    .refine(luhnCheck, 'Invalid card number'),
  cardHolder: z
    .string()
    .min(2, 'Cardholder name is required')
    .max(60, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  expiry: z
    .string()
    .min(1, 'Expiry date is required')
    .refine(isValidExpiry, 'Card is expired or invalid format (MM/YY)'),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export const easypaisaSchema = z.object({
  method:       z.literal('easypaisa'),
  phoneNumber:  z
    .string()
    .min(1, 'Phone number is required')
    .transform(v => v.replace(/\s|-/g, ''))
    .refine(v => PK_MOBILE_REGEX.test(v), 'Enter a valid Pakistani mobile number (03XX-XXXXXXX)'),
  accountTitle: z
    .string()
    .min(2, 'Account title is required')
    .max(50, 'Account title too long'),
});

export const jazzcashSchema = z.object({
  method:       z.literal('jazzcash'),
  phoneNumber:  z
    .string()
    .min(1, 'Phone number is required')
    .transform(v => v.replace(/\s|-/g, ''))
    .refine(v => PK_MOBILE_REGEX.test(v), 'Enter a valid Pakistani mobile number (03XX-XXXXXXX)'),
  accountTitle: z
    .string()
    .min(2, 'Account title is required')
    .max(50, 'Account title too long'),
});

export const bankTransferSchema = z.object({
  method:       z.literal('bank_transfer'),
  iban: z
    .string()
    .min(1, 'IBAN is required')
    .transform(v => v.replace(/\s/g, '').toUpperCase())
    .refine(v => IBAN_REGEX.test(v), 'Invalid IBAN format')
    .refine(v => {
      // If PK prefix, apply stricter validation
      if (v.startsWith('PK')) return PK_IBAN_REGEX.test(v);
      return true;
    }, 'Invalid PK IBAN — must be PK + 2 digits + 4-letter bank code + 16 digits'),
  accountTitle: z
    .string()
    .min(2, 'Account title is required')
    .max(50, 'Account title too long'),
  bankName: z
    .string()
    .min(2, 'Bank name is required')
    .max(80, 'Bank name too long'),
});

// ── Discriminated union ───────────────────────────────────────

export const paymentSchema = z.discriminatedUnion('method', [
  cardSchema,
  easypaisaSchema,
  jazzcashSchema,
  bankTransferSchema,
]);

// ── Typed error map ───────────────────────────────────────────

export type PaymentFieldErrors = Partial<Record<string, string>>;

export interface PaymentValidationResult {
  success: boolean;
  data?: PaymentDetails;
  errors?: PaymentFieldErrors;
}

/**
 * Validate payment details and return a typed error map for the UI.
 * Never throws — always returns a structured result.
 */
export function validatePaymentDetails(
  method: PaymentMethod,
  rawInput: Record<string, unknown>
): PaymentValidationResult {
  const result = paymentSchema.safeParse({ method, ...rawInput });

  if (result.success) {
    return { success: true, data: result.data as PaymentDetails };
  }

  const errors: PaymentFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.join('.');
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}
