/* ═══════════════════════════════════════════════════════════
   src/domains/dashboard/components/DashboardPage.tsx
   venService v2.0
   Unified dashboard page — adapts layout based on user role.
   Admin/Staff see analytics + bookings; Drivers see their
   assigned routes and status.
   ═══════════════════════════════════════════════════════════ */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency } from '../../../lib';
import type { DashboardStats, RevenueDataPoint, PeakHourDataPoint } from '../../../shared/types/domain';

// ── Mock data (replace with useAnalytics hook when backend ready) ──

const MOCK_STATS: DashboardStats = {
    totalRevenue: 2_847_500,
    totalBookings: 1_243,
    activePassengers: 876,
    activeDrivers: 34,
    revenueChange: 12.4,
    bookingsChange: 8.7,
    passengersChange: 5.2,
    driversChange: -2.1,
};

const MOCK_REVENUE: RevenueDataPoint[] = [
    { label: 'Mon', revenue: 320000, bookings: 89 },
    { label: 'Tue', revenue: 410000, bookings: 112 },
    { label: 'Wed', revenue: 385000, bookings: 103 },
    { label: 'Thu', revenue: 520000, bookings: 147 },
    { label: 'Fri', revenue: 490000, bookings: 138 },
    { label: 'Sat', revenue: 610000, bookings: 172 },
    { label: 'Sun', revenue: 512000, bookings: 144 },
];

const MOCK_PEAK_HOURS: PeakHourDataPoint[] = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: Math.round(
        h >= 7 && h <= 9 ? 80 + Math.random() * 40 :
            h >= 17 && h <= 19 ? 90 + Math.random() * 50 :
                h >= 22 || h <= 5 ? 5 + Math.random() * 15 :
                    30 + Math.random() * 30,
    ),
}));

// ── Sub-components ─────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: string;
    change: number;
    icon: string;
    delay?: number;
}

function StatCard({ label, value, change, icon, delay = 0 }: StatCardProps) {
    const positive = change >= 0;
    return (
        <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="stat-card__header">
                <span className="stat-card__icon" aria-hidden="true">{icon}</span>
                <span
                    className={`stat-card__change ${positive ? 'stat-card__change--up' : 'stat-card__change--down'}`}
                    aria-label={`${positive ? 'Up' : 'Down'} ${Math.abs(change)}% from last period`}
                >
                    {positive ? '↑' : '↓'} {Math.abs(change)}%
                </span>
            </div>
            <p className="stat-card__value">{value}</p>
            <p className="stat-card__label">{label}</p>
        </motion.div>
    );
}

// ── Mini bar chart (inline, no recharts dependency) ────────

function MiniBarChart({ data }: { data: RevenueDataPoint[] }) {
    const max = Math.max(...data.map(d => d.revenue));
    return (
        <div className="mini-chart" role="img" aria-label="Weekly revenue chart">
            {data.map((d, i) => (
                <div key={d.label} className="mini-chart__bar-wrap">
                    <motion.div
                        className="mini-chart__bar"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        style={{ height: `${(d.revenue / max) * 100}%`, transformOrigin: 'bottom' }}
                        title={`${d.label}: ${formatCurrency(d.revenue)}`}
                    />
                    <span className="mini-chart__label">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

// ── Driver dashboard ───────────────────────────────────────

function DriverView() {
    const { user } = useAuth();
    return (
        <div className="dashboard-driver">
            <header className="dashboard-driver__header">
                <h2 className="dashboard-driver__greeting">
                    Welcome back, {user?.name?.split(' ')[0] ?? 'Driver'}
                </h2>
                <span className="driver-status driver-status--active">● On Duty</span>
            </header>

            <div className="driver-cards">
                {[
                    { label: 'Today\'s Trips', value: '3', icon: '🚌' },
                    { label: 'KM Covered', value: '248 km', icon: '📍' },
                    { label: 'Rating', value: '4.9 ★', icon: '⭐' },
                ].map((item, i) => (
                    <motion.div
                        key={item.label}
                        className="driver-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.35 }}
                    >
                        <span className="driver-card__icon">{item.icon}</span>
                        <strong className="driver-card__value">{item.value}</strong>
                        <span className="driver-card__label">{item.label}</span>
                    </motion.div>
                ))}
            </div>

            <section className="driver-schedule">
                <h3 className="driver-schedule__title">Today's Schedule</h3>
                {[
                    { time: '08:00', route: 'Lahore → Islamabad', status: 'Completed' },
                    { time: '13:00', route: 'Islamabad → Lahore', status: 'In Progress' },
                    { time: '18:30', route: 'Lahore → Karachi', status: 'Upcoming' },
                ].map(trip => (
                    <div key={trip.time} className="trip-row">
                        <span className="trip-row__time">{trip.time}</span>
                        <span className="trip-row__route">{trip.route}</span>
                        <span className={`trip-row__status trip-row__status--${trip.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {trip.status}
                        </span>
                    </div>
                ))}
            </section>
        </div>
    );
}

// ── Admin / Staff dashboard ────────────────────────────────

function AdminView() {
    const stats = MOCK_STATS;

    const statCards = useMemo(() => [
        { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), change: stats.revenueChange, icon: '💰' },
        { label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), change: stats.bookingsChange, icon: '🎫' },
        { label: 'Active Passengers', value: stats.activePassengers.toLocaleString(), change: stats.passengersChange, icon: '👥' },
        { label: 'Active Drivers', value: stats.activeDrivers.toString(), change: stats.driversChange, icon: '🚌' },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], []);

    return (
        <div className="dashboard-admin">
            {/* Stats grid */}
            <section className="stats-grid" aria-label="Key metrics">
                {statCards.map((card, i) => (
                    <StatCard key={card.label} {...card} delay={i * 0.08} />
                ))}
            </section>

            {/* Revenue chart */}
            <section className="dashboard-panel">
                <header className="dashboard-panel__header">
                    <h3 className="dashboard-panel__title">Weekly Revenue</h3>
                    <span className="dashboard-panel__subtitle">Last 7 days</span>
                </header>
                <MiniBarChart data={MOCK_REVENUE} />
            </section>

            {/* Peak hours summary */}
            <section className="dashboard-panel">
                <header className="dashboard-panel__header">
                    <h3 className="dashboard-panel__title">Peak Booking Hours</h3>
                    <span className="dashboard-panel__subtitle">Hourly distribution</span>
                </header>
                <div className="peak-hours-grid" aria-label="Peak hours">
                    {MOCK_PEAK_HOURS.filter(h => h.hour >= 6 && h.hour <= 22).map(h => {
                        const intensity = Math.round((h.count / 140) * 5);
                        return (
                            <div
                                key={h.hour}
                                className={`peak-cell peak-cell--${intensity}`}
                                title={`${h.hour}:00 — ${h.count} bookings`}
                                role="img"
                                aria-label={`${h.hour}:00, ${h.count} bookings`}
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

// ── Main DashboardPage ─────────────────────────────────────

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const isDriver = user?.role === 'driver';

    return (
        <main className="dashboard-page">
            <motion.div
                key={user?.role}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {isDriver ? <DriverView /> : <AdminView />}
            </motion.div>
        </main>
    );
};

export default DashboardPage;
