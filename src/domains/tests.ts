// src/domains/booking/__tests__/bookingMachine.test.ts
// ─────────────────────────────────────────────────────────────
// Unit tests for the booking state machine.
// Pure functions — no React renderer needed.
// ─────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from 'vitest';
import {
  bookingReducer,
  createInitialState,
} from '../bookingMachine';
import type { BookingMachineState, Van, BookingDateRange } from '../../../shared/types/domain';

const mockVan: Van = {
  id: 'van-1',
  name: 'Toyota HiAce',
  category: 'standard',
  capacity: 12,
  pricePerDay: 5000,
  imageUrl: '/images/hiace.jpg',
  features: ['AC', 'GPS'],
  available: true,
  rating: 4.8,
  reviewCount: 120,
};

const mockDateRange: BookingDateRange = {
  startDate: '2026-03-01',
  endDate:   '2026-03-05',
  days: 4,
};

describe('bookingReducer', () => {
  let state: BookingMachineState;

  beforeEach(() => {
    state = createInitialState();
  });

  it('starts at step 1 with empty draft', () => {
    expect(state.step).toBe(1);
    expect(state.draft.selectedVan).toBeNull();
  });

  it('SELECT_VAN auto-advances to step 2', () => {
    const next = bookingReducer(state, { type: 'SELECT_VAN', van: mockVan });
    expect(next.step).toBe(2);
    expect(next.draft.selectedVan).toEqual(mockVan);
  });

  it('computes totalAmount correctly', () => {
    let s = bookingReducer(state, { type: 'SELECT_VAN', van: mockVan });
    s = bookingReducer(s, { type: 'SET_DATES', dateRange: mockDateRange });
    expect(s.draft.totalAmount).toBe(5000 * 4); // 20000
  });

  it('NEXT_STEP fails with validation error when no van selected', () => {
    const next = bookingReducer(state, { type: 'NEXT_STEP' });
    expect(next.step).toBe(1);
    expect(next.validationErrors.van).toBeTruthy();
  });

  it('NEXT_STEP succeeds from step 2 with dates set', () => {
    let s = bookingReducer(state, { type: 'SELECT_VAN', van: mockVan });
    s = bookingReducer(s, { type: 'SET_DATES', dateRange: mockDateRange });
    const next = bookingReducer(s, { type: 'NEXT_STEP' });
    expect(next.step).toBe(3);
    expect(Object.keys(next.validationErrors)).toHaveLength(0);
  });

  it('PREV_STEP does not go below step 1', () => {
    const next = bookingReducer(state, { type: 'PREV_STEP' });
    expect(next.step).toBe(1);
  });

  it('RESET clears all state', () => {
    let s = bookingReducer(state, { type: 'SELECT_VAN', van: mockVan });
    s = bookingReducer(s, { type: 'RESET' });
    expect(s.draft.selectedVan).toBeNull();
    expect(s.step).toBe(1);
  });

  it('GOTO_STEP prevents skipping forward without completion', () => {
    const next = bookingReducer(state, { type: 'GOTO_STEP', step: 3 });
    expect(next.step).toBe(1);
    expect(next.validationErrors.van).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────

// src/domains/booking/__tests__/paymentValidation.test.ts

import { describe, it, expect } from 'vitest';
import { validatePaymentDetails } from '../paymentValidation';

describe('validatePaymentDetails', () => {
  describe('card', () => {
    it('passes valid Visa card', () => {
      const result = validatePaymentDetails('card', {
        cardNumber: '4532015112830366',
        cardHolder: 'Ahmed Khan',
        expiry:     '12/28',
        cvv:        '123',
      });
      expect(result.success).toBe(true);
    });

    it('fails expired card', () => {
      const result = validatePaymentDetails('card', {
        cardNumber: '4532015112830366',
        cardHolder: 'Ahmed Khan',
        expiry:     '01/20',
        cvv:        '123',
      });
      expect(result.success).toBe(false);
      expect(result.errors?.expiry).toMatch(/expired/i);
    });

    it('fails Luhn check', () => {
      const result = validatePaymentDetails('card', {
        cardNumber: '1234567890123456',
        cardHolder: 'Ahmed Khan',
        expiry:     '12/28',
        cvv:        '123',
      });
      expect(result.success).toBe(false);
      expect(result.errors?.cardNumber).toBeTruthy();
    });
  });

  describe('easypaisa', () => {
    it('passes valid PK mobile number', () => {
      const result = validatePaymentDetails('easypaisa', {
        phoneNumber:  '03001234567',
        accountTitle: 'Ahmed Khan',
      });
      expect(result.success).toBe(true);
    });

    it('fails international number', () => {
      const result = validatePaymentDetails('easypaisa', {
        phoneNumber:  '+1-555-0100',
        accountTitle: 'Ahmed Khan',
      });
      expect(result.success).toBe(false);
      expect(result.errors?.phoneNumber).toMatch(/Pakistani mobile/i);
    });
  });

  describe('bank_transfer', () => {
    it('passes valid PK IBAN', () => {
      const result = validatePaymentDetails('bank_transfer', {
        iban:         'PK36SCBL0000001123456702',
        accountTitle: 'Ahmed Khan',
        bankName:     'Standard Chartered',
      });
      expect(result.success).toBe(true);
    });

    it('fails invalid IBAN structure', () => {
      const result = validatePaymentDetails('bank_transfer', {
        iban:         'NOTANIBAN',
        accountTitle: 'Ahmed Khan',
        bankName:     'HBL',
      });
      expect(result.success).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────

// e2e/booking-flow.spec.ts — Playwright E2E

/*
import { test, expect } from '@playwright/test';

test.describe('Booking flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as customer
    await page.goto('/login');
    await page.getByLabel('Email').fill('customer@test.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/');
  });

  test('completes full booking flow', async ({ page }) => {
    await page.goto('/book');

    // Step 1: Select van
    await expect(page.getByRole('heading', { name: 'Choose Your Van' })).toBeVisible();
    await page.getByTestId('van-card').first().click();

    // Should auto-advance to step 2
    await expect(page.getByRole('heading', { name: 'Select Dates' })).toBeVisible();

    // Step 2: Set dates
    await page.getByLabel('Start Date').fill('2026-04-01');
    await page.getByLabel('End Date').fill('2026-04-05');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: Payment
    await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();
    await page.getByLabel('Card Number').fill('4532015112830366');
    await page.getByLabel('Cardholder Name').fill('Test User');
    await page.getByLabel('Expiry').fill('12/28');
    await page.getByLabel('CVV').fill('123');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 4: Confirm
    await expect(page.getByRole('heading', { name: 'Confirmation' })).toBeVisible();
    await page.getByRole('button', { name: 'Confirm Booking' }).click();

    // Success
    await expect(page.getByText('Booking confirmed')).toBeVisible();
  });

  test('shows validation error when no van selected', async ({ page }) => {
    await page.goto('/book');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('alert')).toContainText('select a van');
  });

  test('survives page refresh with session persistence', async ({ page }) => {
    await page.goto('/book');
    await page.getByTestId('van-card').first().click();
    await page.reload();
    // Should be on step 2 with van still selected
    await expect(page.getByRole('heading', { name: 'Select Dates' })).toBeVisible();
  });
});
*/
