/* ─────────────────────────────────────────────────────────────
   StepSelectService.tsx — Step 1
   Route / service selection with search filter.
   ───────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Route } from '../../types';
import type { FlowState } from './useBookingFlow';
import Badge from '../../components/ui/Badge';

// ── Mock routes data ───────────────────────────────────────────

const MOCK_ROUTES: Route[] = [
    { id: 'r1', from: 'Karachi', to: 'Islamabad', price: 3500, departureTime: '08:00 AM', duration: '14h', seatsLeft: 8, emoji: '🚌', badgeColor: 'green' },
    { id: 'r2', from: 'Lahore', to: 'Karachi', price: 2800, departureTime: '10:30 AM', duration: '11h', seatsLeft: 3, emoji: '🚐', badgeColor: 'amber' },
    { id: 'r3', from: 'Islamabad', to: 'Lahore', price: 1200, departureTime: '07:00 AM', duration: '4h', seatsLeft: 12, emoji: '🚌', badgeColor: 'green' },
    { id: 'r4', from: 'Peshawar', to: 'Karachi', price: 4200, departureTime: '06:00 AM', duration: '18h', seatsLeft: 1, emoji: '🚐', badgeColor: 'red' },
    { id: 'r5', from: 'Multan', to: 'Islamabad', price: 2000, departureTime: '09:00 AM', duration: '8h', seatsLeft: 5, emoji: '🚌', badgeColor: 'amber' },
    { id: 'r6', from: 'Quetta', to: 'Lahore', price: 3800, departureTime: '05:00 AM', duration: '16h', seatsLeft: 10, emoji: '🚐', badgeColor: 'green' },
];

// ── Props ──────────────────────────────────────────────────────

interface Props {
    state: FlowState;
    onSelectRoute: (route: Route) => void;
}

// ── Component ──────────────────────────────────────────────────

export default function StepSelectService({ state, onSelectRoute }: Props) {
    const [search, setSearch] = useState('');

    const filtered = MOCK_ROUTES.filter(r => {
        const q = search.toLowerCase();
        return (
            !q ||
            r.from.toLowerCase().includes(q) ||
            r.to.toLowerCase().includes(q)
        );
    });

    return (
        <div className="booking-step">
            <div className="booking-step__header">
                <h3>Select Your Route</h3>
                <p>Choose from available services departing near you</p>
            </div>

            {/* Search */}
            <div className="booking-step__search">
                <span className="booking-step__search-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search city (e.g. Karachi, Lahore…)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="booking-step__search-input"
                    aria-label="Search routes"
                />
            </div>

            {/* Route grid */}
            <div className="booking-routes-grid">
                {filtered.length === 0 && (
                    <p style={{ color: 'var(--muted)', textAlign: 'center', gridColumn: '1/-1', padding: 'var(--space-10)' }}>
                        No routes found for "{search}"
                    </p>
                )}
                {filtered.map((route, i) => {
                    const isSelected = state.selectedRoute?.id === route.id;
                    return (
                        <motion.button
                            key={route.id}
                            className={`booking-route-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => onSelectRoute(route)}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            aria-pressed={isSelected}
                        >
                            <div className="booking-route-card__header">
                                <span className="booking-route-card__emoji">{route.emoji}</span>
                                <Badge variant={route.badgeColor}>
                                    {route.seatsLeft} left
                                </Badge>
                            </div>
                            <div className="booking-route-card__route">
                                <span className="booking-route-card__city">{route.from}</span>
                                <span className="booking-route-card__arrow">→</span>
                                <span className="booking-route-card__city">{route.to}</span>
                            </div>
                            <div className="booking-route-card__meta">
                                <span>⏱ {route.duration}</span>
                                <span>🕐 {route.departureTime}</span>
                            </div>
                            <div className="booking-route-card__price">
                                Rs. {route.price.toLocaleString()}
                                <span className="booking-route-card__price-label">/seat</span>
                            </div>

                            {isSelected && (
                                <div className="booking-route-card__check">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
