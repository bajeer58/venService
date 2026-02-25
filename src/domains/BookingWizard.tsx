// src/domains/booking/components/BookingWizard.tsx
// ─────────────────────────────────────────────────────────────
// Multi-step booking wizard with:
//   - AnimatePresence step transitions (directional)
//   - Auto-advance on van selection
//   - Sticky summary panel
//   - Accessible step indicator
// ─────────────────────────────────────────────────────────────

import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBooking, useBookingSelector } from '../BookingContext';
import { Button } from '../../../shared/components/atoms';
import type { BookingStep } from '../../../shared/types/domain';

// ── Step metadata ─────────────────────────────────────────────

const STEPS: { step: BookingStep; label: string; description: string }[] = [
  { step: 1, label: 'Choose Van',     description: 'Select your vehicle' },
  { step: 2, label: 'Select Dates',   description: 'Pick rental period' },
  { step: 3, label: 'Payment',        description: 'Enter payment info' },
  { step: 4, label: 'Confirmation',   description: 'Review & confirm' },
];

// ── Step slide variants ───────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-60%' : '60%',
    opacity: 0,
  }),
};

// ── Step Indicator ────────────────────────────────────────────

function StepIndicator({ currentStep, onStepClick }: {
  currentStep: BookingStep;
  onStepClick: (step: BookingStep) => void;
}) {
  return (
    <nav aria-label="Booking progress" className="flex items-center gap-0">
      {STEPS.map((s, idx) => {
        const isComplete = s.step < currentStep;
        const isCurrent  = s.step === currentStep;

        return (
          <div key={s.step} className="flex items-center">
            <button
              onClick={() => isComplete && onStepClick(s.step)}
              disabled={!isComplete}
              aria-current={isCurrent ? 'step' : undefined}
              className={[
                'flex flex-col items-center gap-1.5 group',
                isComplete ? 'cursor-pointer' : 'cursor-default',
              ].join(' ')}
            >
              <div className={[
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200',
                isCurrent  ? 'bg-brand-600 text-white ring-4 ring-brand-100' : '',
                isComplete ? 'bg-success-base text-white group-hover:bg-success-dark' : '',
                !isCurrent && !isComplete ? 'bg-neutral-100 text-neutral-400' : '',
              ].join(' ')}>
                {isComplete ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : s.step}
              </div>
              <div className="hidden sm:flex flex-col items-center">
                <span className={['text-xs font-medium',
                  isCurrent ? 'text-brand-700' : isComplete ? 'text-neutral-700' : 'text-neutral-400',
                ].join(' ')}>{s.label}</span>
                <span className="text-[10px] text-neutral-400">{s.description}</span>
              </div>
            </button>

            {idx < STEPS.length - 1 && (
              <div className={[
                'flex-1 h-0.5 w-12 mx-2 transition-colors duration-300',
                s.step < currentStep ? 'bg-success-base' : 'bg-neutral-200',
              ].join(' ')} aria-hidden />
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ── Booking Summary Panel ─────────────────────────────────────

function BookingSummary() {
  const draft       = useBookingSelector(s => s.draft);
  const totalAmount = useBookingSelector(s => s.draft.totalAmount);
  const { selectedVan, dateRange } = draft;

  if (!selectedVan) return null;

  return (
    <aside
      className="sticky top-6 flex flex-col gap-4 p-5 bg-neutral-50 rounded-xl border border-neutral-200"
      aria-label="Booking summary"
    >
      <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
        Summary
      </h3>

      <div className="flex gap-3">
        <img
          src={selectedVan.imageUrl}
          alt={selectedVan.name}
          className="w-20 h-14 object-cover rounded-lg"
        />
        <div>
          <p className="font-semibold text-neutral-900 text-sm">{selectedVan.name}</p>
          <p className="text-xs text-neutral-500 capitalize">{selectedVan.category}</p>
          <p className="text-xs text-brand-600 font-medium mt-1">
            PKR {selectedVan.pricePerDay.toLocaleString()}/day
          </p>
        </div>
      </div>

      {dateRange && (
        <div className="text-sm space-y-1">
          <div className="flex justify-between text-neutral-600">
            <span>From</span>
            <span className="font-medium">{dateRange.startDate}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>To</span>
            <span className="font-medium">{dateRange.endDate}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Duration</span>
            <span className="font-medium">{dateRange.days} day{dateRange.days !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-3 flex justify-between items-center">
        <span className="text-sm font-semibold text-neutral-700">Total</span>
        <span className="text-lg font-bold text-neutral-900">
          PKR {totalAmount.toLocaleString()}
        </span>
      </div>
    </aside>
  );
}

// ── Wizard Shell ──────────────────────────────────────────────

interface BookingWizardProps {
  /** Render props pattern — inject step content */
  renderStep: (step: BookingStep) => React.ReactNode;
}

export function BookingWizard({ renderStep }: BookingWizardProps) {
  const { state, gotoStep, nextStep, prevStep, submitBooking } = useBooking();
  const { step, isSubmitting, validationErrors } = state;
  const prevStepRef = useRef<BookingStep>(1);
  const direction   = step > prevStepRef.current ? 1 : -1;
  prevStepRef.current = step;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="flex justify-center mb-10">
        <StepIndicator currentStep={step} onStepClick={gotoStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main step content */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
              {renderStep(step)}
            </motion.div>
          </AnimatePresence>

          {/* Validation errors */}
          {Object.keys(validationErrors).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-danger-light rounded-lg border border-danger-base/20"
              role="alert"
            >
              {Object.values(validationErrors).map((err, i) => (
                <p key={i} className="text-sm text-danger-dark font-medium">{err}</p>
              ))}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={step === 1}
            >
              ← Back
            </Button>

            {step < 4 ? (
              <Button onClick={nextStep} size="lg">
                Continue →
              </Button>
            ) : (
              <Button
                size="lg"
                loading={isSubmitting}
                onClick={submitBooking}
              >
                Confirm Booking
              </Button>
            )}
          </div>
        </div>

        {/* Sticky summary */}
        <BookingSummary />
      </div>
    </div>
  );
}
