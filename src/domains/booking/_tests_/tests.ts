/* ═══════════════════════════════════════════════════════════
   src/domains/booking/_tests_/tests.ts — venService v2.0
   Unit tests for the booking domain layer.
   Tests cover: state machine, validation, and lib utilities.
   Run with: npx vitest (or your preferred test runner).
   ═══════════════════════════════════════════════════════════ */

import {
    bookingReducer,
    INITIAL_CONTEXT,
    canProceedToPayment,
    canConfirm,
    isConfirmed,
    type BookingMachineContext,
} from '../bookingMachine';

import {
    validatePassenger,
    validatePayment,
    calculateTotal,
} from '../paymentValidation';

import {
    isValidEmail,
    isValidCardNumber,
    isCardExpired,
    formatCurrency,
    formatDuration,
    clamp,
    groupBy,
    cx,
} from '../../../lib';

import type { ServiceRoute, Schedule, Seat, PassengerDetails, PaymentDetails } from '../../../shared/types/domain';

// ── Test helpers ───────────────────────────────────────────

function assert(condition: boolean, message: string): void {
    if (!condition) throw new Error(`FAIL: ${message}`);
    console.log(`  ✓ ${message}`);
}

function assertEq<T>(actual: T, expected: T, message: string): void {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error(`FAIL: ${message}\n  expected: ${b}\n  received: ${a}`);
    console.log(`  ✓ ${message}`);
}

// ── Fixtures ───────────────────────────────────────────────

const mockRoute: ServiceRoute = {
    id: 'route-1', name: 'Test Route', origin: 'A', destination: 'B',
    distance: 100, duration: 60, basePrice: 1000, amenities: [],
};

const mockSchedule: Schedule = {
    id: 'sched-1', routeId: 'route-1',
    departureAt: new Date(Date.now() + 86400000).toISOString(),
    arrivalAt: new Date(Date.now() + 90000000).toISOString(),
    totalSeats: 40, bookedSeats: 5, vehicleType: 'bus',
};

const mockSeat: Seat = { id: 'seat-1', number: '1A', status: 'available' };

const mockPassenger: PassengerDetails = {
    firstName: 'Ali', lastName: 'Khan', email: 'ali@test.com', phone: '03001234567',
};

const mockPayment: PaymentDetails = {
    method: 'card', cardNumber: '4532015112830366',
    cardName: 'Ali Khan', expiry: '12/26', cvv: '123',
};

// ── State Machine Tests ────────────────────────────────────

function testStateMachine(): void {
    console.log('\n[bookingMachine]');

    // Initial state
    assertEq(INITIAL_CONTEXT.step, 'idle', 'starts in idle state');
    assert(INITIAL_CONTEXT.selectedSeats.length === 0, 'starts with no seats');

    // SELECT_ROUTE
    const afterRoute = bookingReducer(INITIAL_CONTEXT, { type: 'SELECT_ROUTE', route: mockRoute });
    assertEq(afterRoute.step, 'selecting-datetime', 'SELECT_ROUTE → selecting-datetime');
    assertEq(afterRoute.selectedRoute?.id, 'route-1', 'route is stored');

    // SELECT_SCHEDULE
    const afterSchedule = bookingReducer(afterRoute, { type: 'SELECT_SCHEDULE', schedule: mockSchedule });
    assertEq(afterSchedule.step, 'passenger-details', 'SELECT_SCHEDULE → passenger-details');

    // SELECT_SEAT
    const afterSeat = bookingReducer(afterSchedule, { type: 'SELECT_SEAT', seat: mockSeat });
    assert(afterSeat.selectedSeats.length === 1, 'seat added');
    assertEq(afterSeat.totalAmount, 1000, 'total = basePrice × 1');

    // DESELECT_SEAT
    const afterDeselect = bookingReducer(afterSeat, { type: 'DESELECT_SEAT', seatId: 'seat-1' });
    assert(afterDeselect.selectedSeats.length === 0, 'seat removed');

    // SET_PASSENGER
    const afterPassenger = bookingReducer(
        { ...afterSeat, step: 'passenger-details' },
        { type: 'SET_PASSENGER', passenger: mockPassenger },
    );
    assertEq(afterPassenger.step, 'payment', 'SET_PASSENGER → payment');

    // SET_PAYMENT + CONFIRM
    const afterPayment = bookingReducer(afterPassenger, { type: 'SET_PAYMENT', payment: mockPayment });
    const afterConfirm = bookingReducer(afterPayment, { type: 'CONFIRM' });
    assertEq(afterConfirm.step, 'confirmed', 'CONFIRM → confirmed');
    assert(!!afterConfirm.confirmationId, 'confirmationId generated');

    // RESET
    const afterReset = bookingReducer(afterConfirm, { type: 'RESET' });
    assertEq(afterReset.step, 'idle', 'RESET → idle');

    // BACK
    const stateAtPayment: BookingMachineContext = { ...INITIAL_CONTEXT, step: 'payment' };
    const afterBack = bookingReducer(stateAtPayment, { type: 'BACK' });
    assertEq(afterBack.step, 'passenger-details', 'BACK from payment → passenger-details');

    // Guards
    const readyCtx: BookingMachineContext = {
        ...INITIAL_CONTEXT,
        selectedRoute: mockRoute,
        selectedSchedule: mockSchedule,
        selectedSeats: [mockSeat],
        passenger: mockPassenger,
        step: 'payment',
    };
    assert(canProceedToPayment(readyCtx), 'canProceedToPayment() is true when ready');
    assert(!canProceedToPayment(INITIAL_CONTEXT), 'canProceedToPayment() false when idle');
    assert(!isConfirmed(INITIAL_CONTEXT), 'isConfirmed() false when idle');
    assert(isConfirmed({ ...readyCtx, step: 'confirmed', confirmationId: 'VEN-ABC', payment: mockPayment }), 'isConfirmed() true when confirmed');
    void canConfirm; // tested via integration path above
}

// ── Validation Tests ───────────────────────────────────────

function testPassengerValidation(): void {
    console.log('\n[validatePassenger]');

    const { isValid: ok } = validatePassenger(mockPassenger);
    assert(ok, 'valid passenger passes');

    const { errors: e1 } = validatePassenger({ ...mockPassenger, email: 'not-an-email' });
    assert(!!e1.email, 'invalid email is flagged');

    const { errors: e2 } = validatePassenger({ ...mockPassenger, phone: '12345' });
    assert(!!e2.phone, 'invalid phone is flagged');

    const { errors: e3 } = validatePassenger({ ...mockPassenger, firstName: 'A' });
    assert(!!e3.firstName, 'too-short firstName is flagged');

    const { isValid: allMissing } = validatePassenger({});
    assert(!allMissing, 'empty passenger fails');
}

function testPaymentValidation(): void {
    console.log('\n[validatePayment]');

    const { isValid: cardOk } = validatePayment(mockPayment);
    assert(cardOk, 'valid card payment passes');

    const { errors: e1 } = validatePayment({ ...mockPayment, cardNumber: '1234' });
    assert(!!e1.cardNumber, 'invalid card number is flagged');

    const { errors: e2 } = validatePayment({ ...mockPayment, expiry: '01/20' });
    assert(!!e2.expiry, 'expired card is flagged');

    const { errors: e3 } = validatePayment({ ...mockPayment, cvv: '12' });
    assert(!!e3.cvv, 'short CVV is flagged');

    const { isValid: cashOk } = validatePayment({ method: 'cash' });
    assert(cashOk, 'cash payment always passes');

    const { isValid: epBad } = validatePayment({ method: 'easypaisa', mobileNumber: 'abc' });
    assert(!epBad, 'invalid EasyPaisa number fails');
}

function testCalculateTotal(): void {
    console.log('\n[calculateTotal]');

    const { subtotal, fee, total } = calculateTotal(1000, 2, 'card');
    assertEq(subtotal, 2000, 'subtotal = price × seats');
    assertEq(fee, 100, '5% card fee');
    assertEq(total, 2100, 'total = subtotal + fee');

    const cash = calculateTotal(1000, 1, 'cash');
    assertEq(cash.fee, 0, 'cash has no fee');
}

// ── Lib Utility Tests ──────────────────────────────────────

function testLibUtilities(): void {
    console.log('\n[lib utilities]');

    assert(isValidEmail('user@example.com'), 'valid email');
    assert(!isValidEmail('not-an-email'), 'invalid email');

    assert(isValidCardNumber('4532015112830366'), 'valid Visa (Luhn)');
    assert(!isValidCardNumber('1234567890123456'), 'invalid Luhn');

    assert(!isCardExpired('12/30'), 'future card not expired');
    assert(isCardExpired('01/20'), 'past card expired');

    assertEq(formatCurrency(3500), 'PKR\u00a03,500', 'formatCurrency PKR');
    assertEq(formatDuration(135), '2h 15m', 'formatDuration 135min');
    assertEq(clamp(15, 0, 10), 10, 'clamp upper bound');
    assertEq(clamp(-5, 0, 10), 0, 'clamp lower bound');

    const grouped = groupBy([{ k: 'a' }, { k: 'b' }, { k: 'a' }], 'k');
    assertEq(grouped['a'].length, 2, 'groupBy groups correctly');

    assertEq(cx('a', false, 'b', null, 'c'), 'a b c', 'cx filters falsy');
}

// ── Test runner ────────────────────────────────────────────

export function runAllTests(): void {
    console.log('═══ venService Booking Domain Tests ═══');
    const suites = [
        testStateMachine,
        testPassengerValidation,
        testPaymentValidation,
        testCalculateTotal,
        testLibUtilities,
    ];
    let passed = 0;
    let failed = 0;
    suites.forEach(suite => {
        try {
            suite();
            passed++;
        } catch (err) {
            console.error(err instanceof Error ? err.message : err);
            failed++;
        }
    });
    console.log(`\n══ Results: ${passed} suites passed, ${failed} failed ══`);
}

// Run immediately when executed directly (e.g. `npx ts-node tests.ts`)
runAllTests();
