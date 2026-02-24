/* ─────────────────────────────────────────────
   Seat Occupancy Radial Bar Chart.
   Circular visualization of occupancy rates.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import {
    RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip,
} from 'recharts';
import type { SeatOccupancy } from '../../types';

interface OccupancyChartProps {
    data: SeatOccupancy[];
    isLoading?: boolean;
}

const colors = ['#1a6bff', '#00d68f', '#f5a623', '#ff4757'];

export default function OccupancyChart({ data, isLoading }: OccupancyChartProps) {
    if (isLoading) {
        return <div className="chart-card skeleton" style={{ minHeight: 300, opacity: 0.5 }} />;
    }

    const chartData = data.map((d, i) => ({
        name: d.category,
        uv: d.occupancy,
        fill: colors[i % colors.length],
    }));

    return (
        <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="chart-header" style={{ marginBottom: 20 }}>
                <div className="chart-title">Seat Occupancy Rates</div>
                <div className="chart-subtitle">Utilization across categories</div>
            </div>

            <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="100%"
                        barSize={10}
                        data={chartData}
                    >
                        <RadialBar
                            label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                            background
                            dataKey="uv"
                            animationDuration={1500}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#161c2d',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 8,
                                color: '#e8eaf2',
                                fontSize: 13,
                            }}
                            formatter={(val: number | string | undefined) => [`${val || 0}%`, 'Occupancy']}
                        />
                        <Legend
                            iconSize={10}
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ fontSize: 12, color: '#6b7394' }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
