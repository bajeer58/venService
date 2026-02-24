/* ─────────────────────────────────────────────
   Revenue/KPI summary cards for admin dashboard.
   Animated counters and trend indicators.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import type { KpiCard } from '../../types';

interface RevenueCardsProps {
  data: KpiCard[];
  isLoading?: boolean;
}

/** Map KPI color variants to CSS classes */
const colorClass: Record<string, string> = {
  blue: 'kv-blue',
  green: 'kv-green',
  amber: 'kv-amber',
  text: 'kv-text',
};

export default function RevenueCards({ data, isLoading }: RevenueCardsProps) {
  if (isLoading) {
    return (
      <div className="admin-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="kpi-card" style={{ opacity: 0.5 }}>
            <div className="kpi-label" style={{ width: '60%', height: 14, background: 'var(--surface2)', borderRadius: 8 }} />
            <div className="kpi-value" style={{ width: '50%', height: 32, background: 'var(--surface2)', borderRadius: 8, marginTop: 8 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-grid">
      {data.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          className="kpi-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}
        >
          <div className="kpi-label">{kpi.label}</div>
          <motion.div
            className={`kpi-value ${colorClass[kpi.color] || ''}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
          >
            {kpi.value}
          </motion.div>
          <div className={`kpi-change ${kpi.trend}`}>
            {kpi.trend === 'up' ? '▲' : '▼'} {kpi.change}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
