/* ─────────────────────────────────────────────
   Booking page — seat selection + booking flow.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import SeatMap from '../components/seats/SeatMap';
import BookingSummary from '../components/seats/BookingSummary';

export default function BookingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section id="seat-section" style={{ paddingTop: 120 }}>
        <motion.div
          className="section-label"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Interactive Seat Map
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Pick Your <span className="hi">Perfect Seat</span>
        </motion.h2>
        <motion.p
          className="section-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Real-time seat locking prevents double bookings. Seats hold for 5 minutes after selection.
        </motion.p>

        <motion.div
          className="seat-demo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <SeatMap />
          <BookingSummary />
        </motion.div>
      </section>
    </motion.div>
  );
}