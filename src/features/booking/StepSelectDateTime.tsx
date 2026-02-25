/* ─────────────────────────────────────────────────────────────
   StepSelectDateTime.tsx — Step 2
   Date picker + time slot selection.
   ───────────────────────────────────────────────────────────── */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { FlowState, TimeSlot } from './useBookingFlow';

// generate mock time slots
function generateSlots(date: string): TimeSlot[] {
    const seed = date ? date.charCodeAt(date.length - 1) : 0;
    const base = [
        { time: '06:00 AM', seatsLeft: 12, vanId: 'KI-01' },
        { time: '08:30 AM', seatsLeft: 5, vanId: 'KI-02' },
        { time: '11:00 AM', seatsLeft: 8, vanId: 'KI-03' },
        { time: '02:00 PM', seatsLeft: 2, vanId: 'KI-04' },
        { time: '05:00 PM', seatsLeft: 0, vanId: 'KI-05' },
        { time: '09:00 PM', seatsLeft: 11, vanId: 'KI-06' },
    ];
    return base.map((b, i) => ({
        id: `slot-${i}-${seed}`,
        ...b,
    }));
}

function getTomorrow(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
}

interface Props {
    state: FlowState;
    onSetDate: (date: string) => void;
    onSelectSlot: (slot: TimeSlot) => void;
}

export default function StepSelectDateTime({ state, onSetDate, onSelectSlot }: Props) {
    const slots = useMemo(() => generateSlots(state.selectedDate), [state.selectedDate]);
    const minDate = getTomorrow();

    return (
        <div className="booking-step">
            <div className="booking-step__header">
                <h3>Date &amp; Departure Time</h3>
                <p>
                    {state.selectedRoute
                        ? `${state.selectedRoute.from} → ${state.selectedRoute.to}`
                        : 'Select a route first'}
                </p>
            </div>

            {/* Date picker */}
            <div className="booking-step__date-row">
                <label htmlFor="travel-date" className="input-label">Travel Date</label>
                <input
                    id="travel-date"
                    type="date"
                    className="booking-date-input"
                    value={state.selectedDate}
                    min={minDate}
                    onChange={e => onSetDate(e.target.value)}
                    aria-label="Select travel date"
                />
            </div>

            {/* Time slots */}
            <div className="booking-slots-grid">
                {slots.map((slot, i) => {
                    const isSelected = state.selectedTimeSlot?.id === slot.id;
                    const isFull = slot.seatsLeft === 0;

                    return (
                        <motion.button
                            key={slot.id}
                            className={`booking-slot ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
                            onClick={() => !isFull && onSelectSlot(slot)}
                            disabled={isFull}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={!isFull ? { scale: 1.02 } : {}}
                            aria-pressed={isSelected}
                            aria-disabled={isFull}
                        >
                            <span className="booking-slot__time">{slot.time}</span>
                            <span className={`booking-slot__seats ${slot.seatsLeft <= 3 ? 'low' : ''}`}>
                                {isFull ? 'Full' : `${slot.seatsLeft} seats`}
                            </span>
                            {isSelected && (
                                <span className="booking-slot__check">✓</span>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {state.selectedTimeSlot && (
                <motion.div
                    className="booking-step__selected-info"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    ✅ Departure at <strong>{state.selectedTimeSlot.time}</strong> — Van {state.selectedTimeSlot.vanId}
                </motion.div>
            )}
        </div>
    );
}
