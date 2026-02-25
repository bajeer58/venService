/* ═══════════════════════════════════════════════════════════
   src/domains/booking/hooks/useBookingQueries.ts
   venService v2.0
   Custom hooks for booking-related data fetching.
   Uses a lightweight fetch wrapper — replace with React Query
   or SWR when the backend is connected.
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import type { ServiceRoute, Schedule } from '../../../shared/types/domain';
import { sleep } from '../../../lib';

// ── Generic query state ────────────────────────────────────

interface QueryState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

// ── Mock data (replace with real API calls) ─────────────────

const MOCK_ROUTES: ServiceRoute[] = [
    {
        id: 'route-lhe-khi',
        name: 'Lahore → Karachi Express',
        origin: 'Lahore',
        destination: 'Karachi',
        distance: 1210,
        duration: 720,
        basePrice: 3500,
        amenities: ['WiFi', 'AC', 'Recliner', 'Charging'],
        isPopular: true,
    },
    {
        id: 'route-isl-lhe',
        name: 'Islamabad → Lahore Business',
        origin: 'Islamabad',
        destination: 'Lahore',
        distance: 375,
        duration: 240,
        basePrice: 1200,
        amenities: ['WiFi', 'AC', 'Snacks'],
        isPopular: true,
    },
    {
        id: 'route-khi-hyd',
        name: 'Karachi → Hyderabad Shuttle',
        origin: 'Karachi',
        destination: 'Hyderabad',
        distance: 165,
        duration: 120,
        basePrice: 600,
        amenities: ['AC'],
        isPopular: false,
    },
];

function generateSchedules(routeId: string): Schedule[] {
    const now = new Date();
    return Array.from({ length: 5 }, (_, i) => {
        const dep = new Date(now.getTime() + (i + 1) * 4 * 60 * 60 * 1000);
        const route = MOCK_ROUTES.find(r => r.id === routeId);
        const arr = new Date(dep.getTime() + (route?.duration ?? 240) * 60 * 1000);
        return {
            id: `${routeId}-sched-${i}`,
            routeId,
            departureAt: dep.toISOString(),
            arrivalAt: arr.toISOString(),
            totalSeats: 40,
            bookedSeats: Math.floor(Math.random() * 30),
            vehicleType: i % 3 === 0 ? 'premier' : i % 2 === 0 ? 'van' : 'bus',
        } satisfies Schedule;
    });
}

// ── useRoutes ──────────────────────────────────────────────

/**
 * Fetch all available service routes.
 */
export function useRoutes(): QueryState<ServiceRoute[]> {
    const [data, setData] = useState<ServiceRoute[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        (async () => {
            try {
                // Replace with: const res = await fetch('/api/v1/routes');
                await sleep(400);
                if (!cancelled) setData(MOCK_ROUTES);
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load routes.');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [tick]);

    const refetch = useCallback(() => setTick(t => t + 1), []);
    return { data, isLoading, error, refetch };
}

// ── useSchedules ────────────────────────────────────────────

/**
 * Fetch schedules for a given route ID.
 * @param routeId — null/undefined means hook is idle.
 */
export function useSchedules(routeId: string | null | undefined): QueryState<Schedule[]> {
    const [data, setData] = useState<Schedule[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!routeId) {
            setData(null);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        (async () => {
            try {
                // Replace with: const res = await fetch(`/api/v1/routes/${routeId}/schedules`);
                await sleep(300);
                if (!cancelled) setData(generateSchedules(routeId));
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load schedules.');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [routeId, tick]);

    const refetch = useCallback(() => setTick(t => t + 1), []);
    return { data, isLoading, error, refetch };
}

// ── useBookingConfirmation ──────────────────────────────────

interface ConfirmationResult {
    isSubmitting: boolean;
    error: string | null;
    submit: (bookingData: Record<string, unknown>) => Promise<string | null>;
}

/**
 * Submit a booking and return the confirmation ID.
 */
export function useBookingConfirmation(): ConfirmationResult {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = useCallback(async (bookingData: Record<string, unknown>): Promise<string | null> => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Replace with: const res = await fetch('/api/v1/bookings', { method: 'POST', body: JSON.stringify(bookingData) });
            await sleep(800);
            void bookingData; // suppress unused warning until real API
            return `VEN-${Date.now().toString(36).toUpperCase()}`;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Booking failed. Please try again.';
            setError(msg);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    return { isSubmitting, error, submit };
}
