/* ─────────────────────────────────────────────
   Peak Hours Bar Chart.
   Analyzes booking density throughout the day.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { PeakHour } from '../../types';

interface PeakHoursChartProps {
    data: PeakHour[];
    isLoading?: boolean;
}

export default function PeakHoursChart({ data, isLoading }: PeakHoursChartProps) {
    if (isLoading) {
        return <div className="chart-card skeleton" style={{ minHeight: 300, opacity: 0.5 }} />;
    }

    return (
        <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="chart-header" style={{ marginBottom: 20 }}>
                <div className="chart-title">Peak Booking Hours</div>
                <div className="chart-subtitle">Demand distribution by time of day</div>
            </div>

            <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="hour"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7394', fontSize: 11 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7394', fontSize: 11 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#161c2d',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 8,
                                color: '#e8eaf2',
                                fontSize: 13,
                            }}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        />
                        <Bar
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                            animationDuration={1200}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.count > 100 ? '#1a6bff' : 'rgba(26, 107, 255, 0.5)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
