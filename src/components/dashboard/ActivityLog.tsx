/* ─────────────────────────────────────────────
   Staff activity log for admin dashboard.
   Shows recent actions with type indicators.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import type { ActivityLogEntry } from '../../types';

interface ActivityLogProps {
  entries: ActivityLogEntry[];
  isLoading?: boolean;
}

const typeIcons: Record<string, string> = {
  booking: '🎫',
  cancellation: '❌',
  login: '🔑',
  export: '📥',
};

const typeColors: Record<string, string> = {
  booking: 'var(--green)',
  cancellation: 'var(--red)',
  login: 'var(--blue)',
  export: 'var(--amber)',
};

export default function ActivityLog({ entries, isLoading }: ActivityLogProps) {
  if (isLoading) {
    return (
      <div className="panel-card">
        <div className="panel-title">📋 Activity Log</div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            height: 48, background: 'var(--surface2)', borderRadius: 8, marginBottom: 8, opacity: 0.4,
          }} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="panel-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="panel-title">📋 Activity Log</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: 'var(--surface2)',
              borderRadius: 10,
              borderLeft: `3px solid ${typeColors[entry.type] || 'var(--muted)'}`,
            }}
          >
            <span style={{ fontSize: 18 }}>{typeIcons[entry.type] || '📝'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>
                {entry.action}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 11 }}>
                {entry.user} · {entry.timestamp}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
