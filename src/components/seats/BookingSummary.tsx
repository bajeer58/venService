/* ─────────────────────────────────────────────
   Booking summary sidebar.
   Shows selected seats, price breakdown, and book button.
   ───────────────────────────────────────────── */

import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../context/BookingContextInstance';
import { PRICE_PER_SEAT } from '../../utils/constants';
import { formatPKR, formatDisplayDate } from '../../utils/formatters';
import Button from '../ui/Button';

export default function BookingSummary() {
  const { state, pricing, selectedSeatLabels, openModal } = useBooking();
  const count = state.selectedSeatIds.size;

  return (
    <div className="booking-summary">
      <div className="bs-title">📋 Booking Summary</div>

      {/* Route display */}
      <div className="route-display">
        <div className="from-to">{state.fromCity} → {state.toCity}</div>
        <div className="details">
          📅 {formatDisplayDate(state.travelDate)} · 🕐 {state.departureTime} · Van #{state.vanId}
        </div>
      </div>

      {/* Selected seats tags */}
      <div className="selected-seats-display">
        <AnimatePresence mode="popLayout">
          {count > 0 ? (
            selectedSeatLabels.map((label) => (
              <motion.div
                key={label}
                className="seat-tag"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                layout
              >
                {label}
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              className="empty-seats-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No seats selected yet. Tap a green seat above.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price breakdown */}
      <div className="price-breakdown">
        <div className="price-row">
          <span>Seats selected</span>
          <motion.span
            key={count}
            initial={{ scale: 1.4, color: '#1a6bff' }}
            animate={{ scale: 1, color: '#e8eaf2' }}
            transition={{ duration: 0.3 }}
          >
            {count}
          </motion.span>
        </div>
        <div className="price-row">
          <span>Price per seat</span>
          <span>{formatPKR(PRICE_PER_SEAT)}</span>
        </div>
        <div className="price-row">
          <span>Service fee (5%)</span>
          <span>{formatPKR(pricing.serviceFee)}</span>
        </div>
        <div className="price-row total">
          <span>Total</span>
          <motion.span
            className="amt"
            key={pricing.total}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {formatPKR(pricing.total)}
          </motion.span>
        </div>
      </div>

      {/* Book button */}
      <Button
        variant="primary"
        fullWidth
        disabled={count === 0}
        onClick={openModal}
        className="book-now-btn"
      >
        {count > 0
          ? `Book ${count} Seat${count > 1 ? 's' : ''} — ${formatPKR(pricing.total)}`
          : 'Select seats to continue'}
      </Button>
    </div>
  );
}
