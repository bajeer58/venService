/* ─────────────────────────────────────────────────────────────
   StepSuccess.tsx — Step 5
   Booking confirmation / success screen.
   ───────────────────────────────────────────────────────────── */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { FlowState } from './useBookingFlow';

interface Props {
    state: FlowState;
    onReset: () => void;
}

export default function StepSuccess({ state, onReset }: Props) {
    const navigate = useNavigate();
    const { selectedRoute, selectedDate, selectedTimeSlot, passenger, bookingRef } = state;
    const price = selectedRoute?.price ?? 0;
    const fee = Math.round(price * 0.05);
    const total = price + fee;

    const fullName = `${passenger.firstName} ${passenger.lastName}`.trim() || 'Passenger';

    return (
        <div className="booking-step booking-success">
            {/* Animated checkmark */}
            <motion.div
                className="booking-success__icon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </motion.div>

            <motion.h2
                className="booking-success__title"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                Booking Confirmed!
            </motion.h2>

            <motion.p
                className="booking-success__subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
            >
                Your seat is secured, {fullName.split(' ')[0]}. Have a safe journey! 🎉
            </motion.p>

            {/* Reference */}
            {bookingRef && (
                <motion.div
                    className="booking-success__ref"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 }}
                >
                    <span className="booking-success__ref-label">Booking Reference</span>
                    <span className="booking-success__ref-code">{bookingRef}</span>
                </motion.div>
            )}

            {/* Summary table */}
            <motion.div
                className="booking-success__summary"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
            >
                <div className="booking-success__summary-row">
                    <span>Passenger</span>
                    <span>{fullName}</span>
                </div>
                {passenger.phone && (
                    <div className="booking-success__summary-row">
                        <span>Phone</span>
                        <span>{passenger.phone}</span>
                    </div>
                )}
                <div className="booking-success__summary-row">
                    <span>Route</span>
                    <span>{selectedRoute ? `${selectedRoute.from} → ${selectedRoute.to}` : '—'}</span>
                </div>
                <div className="booking-success__summary-row">
                    <span>Date</span>
                    <span>{selectedDate}</span>
                </div>
                <div className="booking-success__summary-row">
                    <span>Departure</span>
                    <span>{selectedTimeSlot?.time ?? '—'}</span>
                </div>
                <div className="booking-success__summary-row booking-success__summary-row--total">
                    <span>Total Paid</span>
                    <span>Rs. {total.toLocaleString()}</span>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                className="booking-success__actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
            >
                <button className="btn btn-primary btn-lg" onClick={onReset}>
                    Book Another Trip
                </button>
                <button className="btn btn-ghost" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
}
