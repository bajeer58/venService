/* ═══════════════════════════════════════════════════════════
   src/lib/index.ts — venService v2.0
   Utility library — pure functions, no React dependencies.
   All exports must be tree-shakeable and side-effect free.
   ═══════════════════════════════════════════════════════════ */

// ── String utilities ───────────────────────────────────────

/** Capitalise first letter of every word. */
export function titleCase(str: string): string {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

/** Convert email prefix to a display name. */
export function emailToName(email: string): string {
    return titleCase(email.split('@')[0].replace(/[._-]/g, ' '));
}

/** Truncate a string to maxLength, appending '…' if needed. */
export function truncate(str: string, maxLength: number): string {
    return str.length <= maxLength ? str : `${str.slice(0, maxLength - 1)}…`;
}

// ── Number / currency utilities ────────────────────────────

/** Format a number as PKR currency. */
export function formatCurrency(
    amount: number,
    currency = 'PKR',
    locale = 'en-PK',
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

/** Clamp a number between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// ── Date / time utilities ──────────────────────────────────

/** Format ISO date string → "Mon, 26 Feb 2026". */
export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/** Format duration in minutes → "2h 15m". */
export function formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`;
}

/** Check if a date string is in the past. */
export function isPast(iso: string): boolean {
    return new Date(iso).getTime() < Date.now();
}

// ── Validation utilities ───────────────────────────────────

/** Validate email format. */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Luhn algorithm — validate credit card numbers. */
export function isValidCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return digits.length >= 13 && sum % 10 === 0;
}

/** Check if a card expiry MM/YY is still valid. */
export function isCardExpired(expiry: string): boolean {
    const [mm, yy] = expiry.split('/').map(Number);
    if (!mm || !yy) return true;
    const exp = new Date(2000 + yy, mm - 1, 1);
    return exp < new Date();
}

// ── Array utilities ────────────────────────────────────────

/** Group an array of objects by a key. */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce<Record<string, T[]>>((acc, item) => {
        const k = String(item[key]);
        (acc[k] ??= []).push(item);
        return acc;
    }, {});
}

/** Return unique items from an array. */
export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

// ── Async utilities ────────────────────────────────────────

/** Sleep for a given number of milliseconds. */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** Retry an async operation up to `attempts` times. */
export async function retry<T>(
    fn: () => Promise<T>,
    attempts = 3,
    delayMs = 500,
): Promise<T> {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === attempts - 1) throw err;
            await sleep(delayMs * 2 ** i);
        }
    }
    // unreachable — TypeScript requires explicit return
    throw new Error('retry: exhausted all attempts');
}

// ── Class name utility ─────────────────────────────────────

/** Merge class names, filtering falsy values (lightweight cx). */
export function cx(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}
