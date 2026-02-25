/* ─────────────────────────────────────────────────────────────
   BookingFlowPage.tsx — venService v2.0
   Orchestrates the 5-step booking flow.
   ───────────────────────────────────────────────────────────── */

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { useBookingFlow } from './useBookingFlow';
import BookingProgressBar from './BookingProgressBar';
import StepSelectService from './StepSelectService';
import StepSelectDateTime from './StepSelectDateTime';
import StepPassengerDetails from './StepPassengerDetails';
import StepPayment from './StepPayment';
import StepSuccess from './StepSuccess';
import type { Route } from '../../types';

// ── Animation variants ─────────────────────────────────────────

const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
};

// ── Component ──────────────────────────────────────────────────

export default function BookingFlowPage() {
    const flow = useBookingFlow();
    const { state } = flow;

    /* ── Advance with validation ─────────────────────────────── */
    const handleNext = useCallback(() => {
        if (state.step === 1 && !state.selectedRoute) {
            toast.error('Please select a route to continue');
            return;
        }
        if (state.step === 2 && !state.selectedTimeSlot) {
            toast.error('Please select a departure time');
            return;
        }
        flow.nextStep();
    }, [flow, state.step, state.selectedRoute, state.selectedTimeSlot]);

    /* ── Confirm booking (Step 4 → 5) ───────────────────────── */
    const handleConfirm = useCallback(async () => {
        const ref = await flow.confirmBooking();
        if (ref) {
            toast.success(`Booking confirmed! Ref: ${ref}`);
        } else {
            toast.error('Please fix the errors before confirming');
        }
    }, [flow]);

    /* ── Reset & restart ─────────────────────────────────────── */
    const handleReset = useCallback(() => {
        flow.reset();
        toast('Starting a new booking', { icon: '🔄' });
    }, [flow]);

    const isLastStep = state.step === 5;

    return (
        <motion.div
            className="booking-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Header */}
            <div className="booking-flow__header">
                <div className="section-label">Online Booking</div>
                <h2>Book Your <span className="hi">Journey</span></h2>
                <p className="section-desc">
                    Secure your seat in minutes — real-time availability, instant confirmation.
                </p>
            </div>

            {/* Progress bar (hide on step 5) */}
            {!isLastStep && (
                <BookingProgressBar currentStep={state.step} />
            )}

            {/* Step content */}
            <div className="booking-flow__body">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state.step}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {state.step === 1 && (
                            <StepSelectService
                                state={state}
                                onSelectRoute={(route: Route) => flow.selectRoute(route)}
                            />
                        )}
                        {state.step === 2 && (
                            <StepSelectDateTime
                                state={state}
                                onSetDate={flow.setDate}
                                onSelectSlot={flow.selectTimeSlot}
                            />
                        )}
                        {state.step === 3 && (
                            <StepPassengerDetails
                                state={state}
                                onUpdate={flow.updatePassenger}
                            />
                        )}
                        {state.step === 4 && (
                            <StepPayment
                                state={state}
                                onUpdate={flow.updatePayment}
                            />
                        )}
                        {state.step === 5 && (
                            <StepSuccess
                                state={state}
                                onReset={handleReset}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation controls (not on step 5) */}
            {!isLastStep && (
                <div className="booking-flow__nav">
                    {state.step > 1 && (
                        <button
                            className="btn btn-ghost"
                            onClick={flow.prevStep}
                            disabled={state.isProcessing}
                        >
                            ← Back
                        </button>
                    )}

                    <div style={{ marginLeft: 'auto' }}>
                        {state.step < 4 ? (
                            <button
                                className="btn btn-primary"
                                onClick={handleNext}
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                className="btn btn-green btn-lg"
                                onClick={handleConfirm}
                                disabled={state.isProcessing}
                                aria-busy={state.isProcessing}
                            >
                                {state.isProcessing ? (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.7s linear infinite' }}>
                                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.25} />
                                            <path d="M21 12a9 9 0 00-9-9" />
                                        </svg>
                                        Processing…
                                    </>
                                ) : (
                                    '✓ Confirm & Pay'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
