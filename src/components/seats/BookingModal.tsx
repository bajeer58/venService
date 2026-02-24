/* ─────────────────────────────────────────────
   Multi-step booking modal.
   Step 1: Passenger details
   Step 2: Payment
   Step 3: Confirmation
   ───────────────────────────────────────────── */

import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { useToast } from '../../context/ToastContext';
import { MODAL_STEPS, PAYMENT_METHODS } from '../../utils/constants';
import { formatPKR, formatDisplayDate } from '../../utils/formatters';
import { createBooking } from '../../services/bookingService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function BookingModal() {
  const {
    state, pricing, selectedSeatLabels,
    closeModal, setModalStep, setPassengerData, setPaymentData,
    setProcessing, confirmBooking,
  } = useBooking();
  const { showToast } = useToast();

  const { modalOpen, modalStep, passengerData, paymentData, isProcessing, confirmedBooking } = state;

  /** Handle final booking confirmation */
  async function handleConfirmPayment() {
    setProcessing(true);
    try {
      const booking = await createBooking(
        passengerData,
        paymentData,
        selectedSeatLabels,
        { from: state.fromCity, to: state.toCity },
        state.travelDate,
        state.departureTime,
        state.vanId,
        pricing.subtotal,
        pricing.serviceFee,
        pricing.total,
      );
      confirmBooking(booking);
      showToast(`Booking ${booking.id} confirmed! Ticket sent via SMS.`, 'success');
    } catch {
      showToast('Booking failed. Please try again.', 'error');
      setProcessing(false);
    }
  }

  /** Slide direction for step transitions */
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <Modal isOpen={modalOpen} onClose={closeModal}>
      <div className="modal-title">Complete Your Booking</div>
      <div className="modal-sub">{MODAL_STEPS[modalStep - 1]}</div>

      {/* Progress dots */}
      <div className="step-indicator">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`step-dot ${n < modalStep ? 'done' : n === modalStep ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Step content with animated transitions */}
      <AnimatePresence mode="wait" custom={modalStep}>
        {/* ── Step 1: Passenger Details ── */}
        {modalStep === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            transition={{ duration: 0.25 }}
          >
            <div className="modal-form">
              <div className="modal-row">
                <div className="modal-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Muhammad"
                    value={passengerData.firstName}
                    onChange={(e) => setPassengerData({ ...passengerData, firstName: e.target.value })}
                  />
                </div>
                <div className="modal-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Ali"
                    value={passengerData.lastName}
                    onChange={(e) => setPassengerData({ ...passengerData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={passengerData.phone}
                  onChange={(e) => setPassengerData({ ...passengerData, phone: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label>CNIC (Optional)</label>
                <input
                  type="text"
                  placeholder="42101-XXXXXXX-X"
                  value={passengerData.cnic}
                  onChange={(e) => setPassengerData({ ...passengerData, cnic: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={passengerData.email}
                  onChange={(e) => setPassengerData({ ...passengerData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-actions">
              <Button
                variant="primary"
                fullWidth
                style={{ padding: 12 }}
                onClick={() => setModalStep(2)}
                disabled={!passengerData.firstName || !passengerData.phone}
              >
                Continue to Payment →
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Payment ── */}
        {modalStep === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            transition={{ duration: 0.25 }}
          >
            <div className="modal-form">
              <div className="modal-field">
                <label>Payment Method</label>
                <select
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                >
                  {PAYMENT_METHODS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label>Mobile / Account Number</label>
                <input
                  type="text"
                  placeholder="0300-1234567"
                  value={paymentData.accountNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                />
              </div>

              {/* Payment summary */}
              <div className="payment-summary-box">
                <div className="psb-label">PAYMENT SUMMARY</div>
                <div className="psb-row sub">
                  <span>{state.selectedSeatIds.size} × Seats ({formatPKR(3500)})</span>
                  <span>{formatPKR(pricing.subtotal)}</span>
                </div>
                <div className="psb-row sub">
                  <span>Service Fee 5%</span>
                  <span>{formatPKR(pricing.serviceFee)}</span>
                </div>
                <div className="psb-row total-row">
                  <span>Total</span>
                  <span>{formatPKR(pricing.total)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setModalStep(1)}>
                ← Back
              </Button>
              <Button
                variant="green"
                style={{ flex: 1, padding: 12 }}
                onClick={handleConfirmPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Confirm & Pay ${formatPKR(pricing.total)}`}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Confirmation ── */}
        {modalStep === 3 && confirmedBooking && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            transition={{ duration: 0.25 }}
          >
            <div className="confirm-screen">
              <motion.div
                className="confirm-emoji"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -15, 15, 0] }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                🎉
              </motion.div>
              <div className="confirm-title">Booking Confirmed!</div>
              <div className="confirm-sub">
                Ticket {confirmedBooking.id} has been sent to your phone via SMS.
              </div>
              <div className="confirm-ticket-box">
                <div className="confirm-route">
                  {confirmedBooking.route.from} → {confirmedBooking.route.to}
                </div>
                <div className="confirm-details">
                  {formatDisplayDate(confirmedBooking.date)} · {confirmedBooking.time} · Seats {confirmedBooking.seats.join(', ')}
                </div>
                <div className="confirm-id">{confirmedBooking.id}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button
                  variant="ghost"
                  style={{ flex: 1, padding: 12 }}
                  onClick={() => {
                    showToast('Ticket saved to Downloads! 📥');
                    closeModal();
                  }}
                >
                  📥 Download PDF
                </Button>
                <Button
                  variant="primary"
                  style={{ flex: 1, padding: 12 }}
                  onClick={closeModal}
                >
                  Done ✓
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
