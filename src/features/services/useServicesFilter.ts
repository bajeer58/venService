/* ─────────────────────────────────────────────────────────────
   useServicesFilter.ts — venService v2.0
   Debounced search + multi-filter hook for service discovery.
   ───────────────────────────────────────────────────────────── */

import { useState, useMemo, useCallback, useRef } from 'react';
import type { Route } from '../../types';

export type SortOption = 'price-asc' | 'price-desc' | 'seats' | 'duration';
export type AvailabilityFilter = 'all' | 'available' | 'low' | 'full';

export interface ServiceFilters {
    search: string;
    maxPrice: number;
    availability: AvailabilityFilter;
    sortBy: SortOption;
}

const DEFAULT_FILTERS: ServiceFilters = {
    search: '',
    maxPrice: 10000,
    availability: 'all',
    sortBy: 'price-asc',
};

const DEBOUNCE_MS = 280;

export function useServicesFilter(routes: Route[]) {
    const [filters, setFilters] = useState<ServiceFilters>(DEFAULT_FILTERS);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /** Update any subset of filters; search is auto-debounced */
    const updateFilter = useCallback(<K extends keyof ServiceFilters>(
        key: K,
        value: ServiceFilters[K]
    ) => {
        setFilters(f => ({ ...f, [key]: value }));

        if (key === 'search') {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setDebouncedSearch(value as string);
            }, DEBOUNCE_MS);
        }
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setDebouncedSearch('');
    }, []);

    const filtered = useMemo(() => {
        let result = [...routes];
        const q = debouncedSearch.toLowerCase().trim();

        // Text search
        if (q) {
            result = result.filter(r =>
                r.from.toLowerCase().includes(q) ||
                r.to.toLowerCase().includes(q)
            );
        }

        // Price filter
        result = result.filter(r => r.price <= filters.maxPrice);

        // Availability filter
        if (filters.availability === 'available') {
            result = result.filter(r => r.seatsLeft > 3);
        } else if (filters.availability === 'low') {
            result = result.filter(r => r.seatsLeft > 0 && r.seatsLeft <= 3);
        } else if (filters.availability === 'full') {
            result = result.filter(r => r.seatsLeft === 0);
        }

        // Sort
        switch (filters.sortBy) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'seats': result.sort((a, b) => b.seatsLeft - a.seatsLeft); break;
            case 'duration': result.sort((a, b) => a.duration.localeCompare(b.duration)); break;
        }

        return result;
    }, [routes, debouncedSearch, filters.maxPrice, filters.availability, filters.sortBy]);

    return { filters, filtered, updateFilter, resetFilters, resultCount: filtered.length };
}
