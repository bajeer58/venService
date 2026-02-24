/* ─────────────────────────────────────────────
   Interactive van seat map.
   Renders a 5×4 grid with legend and driver area.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContextInstance';
import Seat from './Seat';

export default function SeatMap() {
  const { state, toggleSeat } = useBooking();

  return (
    <div className="seat-map-card">
      {/* Header with route info and legend */}
      <div className="seat-map-header">
        <div className="seat-map-title">
          {state.fromCity} → {state.toCity} · Van #{state.vanId} · {state.departureTime}
        </div>
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-dot ld-avail" /> Available
          </div>
          <div className="legend-item">
            <div className="legend-dot ld-sel" /> Selected
          </div>
          <div className="legend-item">
            <div className="legend-dot ld-booked" /> Booked
          </div>
          <div className="legend-item">
            <div className="legend-dot ld-locked" /> Locked
          </div>
        </div>
      </div>

      {/* Van diagram */}
      <div className="van-diagram">
        <div className="van-top">
          <div className="driver-area">🚗 Driver</div>
        </div>

        <motion.div
          className="seats-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.03 }}
        >
          {state.seats.map((seat) => (
            <Seat
              key={seat.id}
              id={seat.id}
              label={seat.label}
              status={seat.status}
              onToggle={toggleSeat}
            />
          ))}
        </motion.div>

        <div className="van-label">↑ Windshield · ↓ Exit Door</div>
      </div>
    </div>
  );
}
