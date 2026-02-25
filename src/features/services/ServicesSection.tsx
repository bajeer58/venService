/* ─────────────────────────────────────────────────────────────
   ServicesSection.tsx — venService v2.0
   Searchable, filterable services/routes discovery panel.
   ───────────────────────────────────────────────────────────── */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useServicesFilter, type SortOption, type AvailabilityFilter } from './useServicesFilter';
import Badge from '../../components/ui/Badge';
import type { Route } from '../../types';

// ── Mock data ──────────────────────────────────────────────────

const ALL_ROUTES: Route[] = [
    { id: 'r1', from: 'Karachi', to: 'Islamabad', price: 3500, departureTime: '08:00 AM', duration: '14h', seatsLeft: 8, emoji: '🚌', badgeColor: 'green' },
    { id: 'r2', from: 'Lahore', to: 'Karachi', price: 2800, departureTime: '10:30 AM', duration: '11h', seatsLeft: 3, emoji: '🚐', badgeColor: 'amber' },
    { id: 'r3', from: 'Islamabad', to: 'Lahore', price: 1200, departureTime: '07:00 AM', duration: '4h', seatsLeft: 12, emoji: '🚌', badgeColor: 'green' },
    { id: 'r4', from: 'Peshawar', to: 'Karachi', price: 4200, departureTime: '06:00 AM', duration: '18h', seatsLeft: 1, emoji: '🚐', badgeColor: 'red' },
    { id: 'r5', from: 'Multan', to: 'Islamabad', price: 2000, departureTime: '09:00 AM', duration: '8h', seatsLeft: 5, emoji: '🚌', badgeColor: 'amber' },
    { id: 'r6', from: 'Quetta', to: 'Lahore', price: 3800, departureTime: '05:00 AM', duration: '16h', seatsLeft: 10, emoji: '🚐', badgeColor: 'green' },
    { id: 'r7', from: 'Faisalabad', to: 'Islamabad', price: 900, departureTime: '11:00 AM', duration: '3h', seatsLeft: 7, emoji: '🚌', badgeColor: 'green' },
    { id: 'r8', from: 'Karachi', to: 'Lahore', price: 3200, departureTime: '09:30 AM', duration: '12h', seatsLeft: 0, emoji: '🚐', badgeColor: 'red' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'seats', label: 'Most Seats' },
    { value: 'duration', label: 'Shortest Trip' },
];

const AVAILABILITY_OPTIONS: { value: AvailabilityFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
    { value: 'low', label: 'Low Seats' },
    { value: 'full', label: 'Full' },
];

// ── Component ──────────────────────────────────────────────────

export default function ServicesSection() {
    const navigate = useNavigate();
    const { filters, filtered, updateFilter, resetFilters, resultCount } = useServicesFilter(ALL_ROUTES);

    const maxPriceInData = useMemo(() => Math.max(...ALL_ROUTES.map(r => r.price)), []);

    return (
        <section id="services" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-20)' }}>
            <div className="section-label">Live Services</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <h2 style={{ marginBottom: 0 }}>
                    Find Your <span className="hi">Route</span>
                </h2>
                {(filters.search || filters.availability !== 'all' || filters.maxPrice < maxPriceInData) && (
                    <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                        ✕ Clear filters
                    </button>
                )}
            </div>

            {/* ── Filter bar ── */}
            <div className="services-filter-bar">
                {/* Search */}
                <div className="services-search">
                    <span className="services-search__icon">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search city…"
                        className="services-search__input"
                        value={filters.search}
                        onChange={e => updateFilter('search', e.target.value)}
                        aria-label="Search routes"
                    />
                </div>

                {/* Availability chips */}
                <div className="services-chips" role="group" aria-label="Filter by availability">
                    {AVAILABILITY_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            className={`services-chip ${filters.availability === opt.value ? 'active' : ''}`}
                            onClick={() => updateFilter('availability', opt.value)}
                            aria-pressed={filters.availability === opt.value}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <select
                    className="services-sort"
                    value={filters.sortBy}
                    onChange={e => updateFilter('sortBy', e.target.value as SortOption)}
                    aria-label="Sort routes"
                >
                    {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Price range */}
            <div className="services-price-range">
                <label className="input-label">
                    Max Price: <strong style={{ color: 'var(--text)' }}>Rs. {filters.maxPrice.toLocaleString()}</strong>
                </label>
                <input
                    type="range"
                    min={500}
                    max={maxPriceInData}
                    step={100}
                    value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', Number(e.target.value))}
                    className="services-price-slider"
                    aria-label="Maximum price filter"
                />
            </div>

            {/* Result count */}
            <p className="services-result-count">
                {resultCount === 0 ? 'No routes match your filters' : `${resultCount} route${resultCount !== 1 ? 's' : ''} found`}
            </p>

            {/* Route grid */}
            <div className="services-grid">
                <AnimatePresence mode="popLayout">
                    {filtered.map((route, i) => (
                        <motion.div
                            key={route.id}
                            className="services-route-card"
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.22, delay: i * 0.04 }}
                        >
                            <div className="services-route-card__top">
                                <span className="services-route-card__emoji">{route.emoji}</span>
                                <Badge variant={route.badgeColor}>{route.seatsLeft > 0 ? `${route.seatsLeft} seats` : 'Full'}</Badge>
                            </div>

                            <div className="services-route-card__route">
                                <span className="services-route-card__city">{route.from}</span>
                                <span className="services-route-card__arrow">→</span>
                                <span className="services-route-card__city">{route.to}</span>
                            </div>

                            <div className="services-route-card__meta">
                                <span>⏱ {route.duration}</span>
                                <span>🕐 {route.departureTime}</span>
                            </div>

                            <div className="services-route-card__footer">
                                <span className="services-route-card__price">
                                    Rs. {route.price.toLocaleString()}
                                    <span className="services-route-card__price-sub">/seat</span>
                                </span>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate('/booking')}
                                    disabled={route.seatsLeft === 0}
                                >
                                    {route.seatsLeft === 0 ? 'Full' : 'Book Now'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {resultCount === 0 && (
                    <motion.div
                        className="services-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span style={{ fontSize: '2.5rem' }}>🔍</span>
                        <p>No routes found. Try adjusting your filters.</p>
                        <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset filters</button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
