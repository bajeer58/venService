/* ─────────────────────────────────────────────
   Route Profitability Composed Chart.
   Combines Bar and Line charts to show revenue vs profit.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import type { RouteProfit } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface RouteProfitChartProps {
    data: RouteProfit[];
    isLoading?: boolean;
}

export default function RouteProfitChart({ data, isLoading }: RouteProfitChartProps) {
    if (isLoading) {
        return <div className="chart-card skeleton" style={{ minHeight: 320, opacity: 0.5 }} />;
    }

    return (
        <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ gridColumn: 'span 2' }}
        >
            <div className="chart-header" style={{ marginBottom: 20 }}>
                <div className="chart-title">Route Profitability Analysis</div>
                <div className="chart-subtitle">Revenue, Operational Cost, and Net Profit per route</div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="route"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7394', fontSize: 11 }}
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
                            formatter={(val: number | string | undefined) => [formatPKR(Number(val || 0)), '']}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10, color: '#6b7394' }} />
                        <Bar dataKey="revenue" fill="#1a6bff" radius={[4, 4, 0, 0]} barSize={40} name="Revenue" />
                        <Bar dataKey="cost" fill="rgba(26, 107, 255, 0.2)" radius={[4, 4, 0, 0]} barSize={40} name="Op. Cost" />
                        <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#00d68f"
                            strokeWidth={3}
                            dot={{ fill: '#00d68f', r: 4 }}
                            name="Net Profit"
                            animationDuration={2000}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
