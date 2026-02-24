/* ─────────────────────────────────────────────
   BI Dashboard Container.
   Manages state and data fetching for all BI charts.
   ───────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    fetchDailyRevenue, fetchPeakHours, fetchSeatOccupancy, fetchRouteProfitability,
} from '../../services/analyticsService';
import type { DailyRevenue, PeakHour, SeatOccupancy, RouteProfit } from '../../types';
import RevenueDetailChart from './RevenueDetailChart';
import PeakHoursChart from './PeakHoursChart';
import OccupancyChart from './OccupancyChart';
import RouteProfitChart from './RouteProfitChart';
import ErrorState from '../ui/ErrorState';

export default function BIDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [revenueData, setRevenueData] = useState<DailyRevenue[]>([]);
    const [peakHoursData, setPeakHoursData] = useState<PeakHour[]>([]);
    const [occupancyData, setOccupancyData] = useState<SeatOccupancy[]>([]);
    const [profitabilityData, setProfitabilityData] = useState<RouteProfit[]>([]);

    async function loadData() {
        setIsLoading(true);
        setError(null);
        try {
            const [r, p, o, pr] = await Promise.all([
                fetchDailyRevenue(),
                fetchPeakHours(),
                fetchSeatOccupancy(),
                fetchRouteProfitability(),
            ]);
            setRevenueData(r);
            setPeakHoursData(p);
            setOccupancyData(o);
            setProfitabilityData(pr);
        } catch (err) {
            console.error('Failed to load BI data:', err);
            setError('We encountered a problem while fetching the analytics data');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    if (error) {
        return <div style={{ marginTop: 20 }}><ErrorState message={error} onRetry={loadData} /></div>;
    }

    return (
        <div className="bi-dashboard-container">
            <motion.div
                className="bi-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 24,
                    marginTop: 20
                }}
            >
                {/* Full width revenue chart */}
                <div style={{ gridColumn: 'span 2' }}>
                    <RevenueDetailChart data={revenueData} isLoading={isLoading} />
                </div>

                {/* Hour analysis */}
                <PeakHoursChart data={peakHoursData} isLoading={isLoading} />

                {/* Occupancy trends */}
                <OccupancyChart data={occupancyData} isLoading={isLoading} />

                {/* Route profitability */}
                <RouteProfitChart data={profitabilityData} isLoading={isLoading} />
            </motion.div>
        </div>
    );
}
