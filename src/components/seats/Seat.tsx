/* ─────────────────────────────────────────────
   Individual seat button in the van layout.
   Supports all four states with animations.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import type { SeatStatus } from '../../types';

interface SeatProps {
  id: number;
  label: string;
  status: SeatStatus;
  onToggle: (id: number) => void;
}

/** Visual config per seat status */
const SEAT_CONFIG: Record<SeatStatus, { icon: string; className: string }> = {
  available: { icon: '💺', className: 's-available' },
  selected:  { icon: '✅', className: 's-selected' },
  booked:    { icon: '🚫', className: 's-booked' },
  locked:    { icon: '🔒', className: 's-locked' },
};

export default function Seat({ id, label, status, onToggle }: SeatProps) {
  const { icon, className } = SEAT_CONFIG[status];
  const isInteractive = status === 'available' || status === 'selected';

  return (
    <motion.button
      className={`seat-btn ${className}`}
      aria-label={`Seat ${label} — ${status}`}
      disabled={!isInteractive}
      onClick={() => isInteractive && onToggle(id)}
      whileHover={isInteractive ? { scale: 1.12 } : {}}
      whileTap={isInteractive ? { scale: 0.9 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <motion.span
          style={{ fontSize: 16 }}
          animate={status === 'selected' ? { rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.span>
        <span className="seat-num">{label}</span>
      </div>
    </motion.button>
  );
}
