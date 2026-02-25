/* ─────────────────────────────────────────────────────────────
   BookingProgressBar.tsx — venService v2.0
   Animated 5-step progress indicator.
   ───────────────────────────────────────────────────────────── */

import { motion } from 'framer-motion';
import type { BookingStep } from './useBookingFlow';

interface Props {
    currentStep: BookingStep;
}

const STEPS = [
    { id: 1, label: 'Service' },
    { id: 2, label: 'Date & Time' },
    { id: 3, label: 'Details' },
    { id: 4, label: 'Payment' },
    { id: 5, label: 'Done' },
];

export default function BookingProgressBar({ currentStep }: Props) {
    return (
        <div className="booking-progress">
            {STEPS.map((step, idx) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                    <div key={step.id} className="booking-progress__item">
                        {/* Connector line */}
                        {idx > 0 && (
                            <div className="booking-progress__line">
                                <motion.div
                                    className="booking-progress__line-fill"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ transformOrigin: 'left' }}
                                />
                            </div>
                        )}

                        {/* Step circle */}
                        <motion.div
                            className={`booking-progress__circle ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                            animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isCompleted ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <span>{step.id}</span>
                            )}
                        </motion.div>

                        {/* Label */}
                        <span className={`booking-progress__label ${isActive ? 'active' : ''}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
