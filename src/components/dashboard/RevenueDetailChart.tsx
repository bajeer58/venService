/* ─────────────────────────────────────────────
   Daily Revenue Area Chart.
   Shows revenue trends over time with smooth gradients.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { DailyRevenue } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface RevenueDetailChartProps {
    data: DailyRevenue[];
    isLoading?: boolean;
}

export default function RevenueDetailChart({ data, isLoading }: RevenueDetailChartProps) {
    if (isLoading) {
        return <div className="chart-card skeleton" style={{ minHeight: 300, opacity: 0.5 }} />;
    }

    return (
        <motion.div
            className="chart-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="chart-header" style={{ marginBottom: 20 }}>
                <div className="chart-title">Daily Revenue Trends</div>
                <div className="chart-subtitle">Last 30 days performance</div>
            </div>

            <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1a6bff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#1a6bff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7394', fontSize: 11 }}
                            tickFormatter={(str) => {
                                const parts = str.split('-');
                                return parts[2]; // Just day
                            }}
                            minTickGap={20}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7394', fontSize: 11 }}
                            tickFormatter={(val) => `₨${val / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#161c2d',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 8,
                                color: '#e8eaf2',
                                fontSize: 13,
                            }}
                            formatter={(val: number | string | undefined) => [formatPKR(Number(val || 0)), 'Revenue']}
                            labelStyle={{ color: '#6b7394', marginBottom: 4 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#1a6bff"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRev)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
