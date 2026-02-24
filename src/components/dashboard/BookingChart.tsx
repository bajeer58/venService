/* ─────────────────────────────────────────────
   Booking statistics charts.
   Bar chart (weekly) + Donut chart (route distribution).
   Uses Recharts library.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import type { WeeklyBooking, RouteDistribution } from '../../types';

interface BookingChartProps {
  weeklyData: WeeklyBooking[];
  routeData: RouteDistribution[];
  isLoading?: boolean;
}

export default function BookingChart({ weeklyData, routeData, isLoading }: BookingChartProps) {
  if (isLoading) {
    return (
      <div className="dash-charts">
        <div className="chart-card" style={{ minHeight: 280, opacity: 0.5 }} />
        <div className="chart-card" style={{ minHeight: 280, opacity: 0.5 }} />
      </div>
    );
  }

  // Total bookings for donut center label
  const totalPct = routeData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="dash-charts">
      {/* Bar chart — weekly bookings */}
      <motion.div
        className="chart-card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="chart-title">Weekly Bookings — Last 7 Days</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="day"
              tick={{ fill: '#6b7394', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b7394', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#161c2d',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8,
                color: '#e8eaf2',
                fontSize: 13,
              }}
              cursor={{ fill: 'rgba(26, 107, 255, 0.08)' }}
            />
            <Bar
              dataKey="count"
              fill="#1a6bff"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Donut chart — route distribution */}
      <motion.div
        className="chart-card"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="chart-title">Bookings by Route</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={routeData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-out"
              >
                {routeData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--text)',
          }}>
            {totalPct}%
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend" style={{ marginTop: 12 }}>
          {routeData.map((item) => (
            <div key={item.name} className="dl-item">
              <span>
                <span className="dl-dot" style={{ background: item.color }} />
                {item.name}
              </span>
              <span>{item.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
