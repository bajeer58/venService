/* ─────────────────────────────────────────────────────────────
   StepPassengerDetails.tsx — Step 3
   Validated passenger form using the Input primitive.
   ───────────────────────────────────────────────────────────── */

import Input from '../../components/ui/Input';
import type { FlowState } from './useBookingFlow';
import type { PassengerFormData } from '../../types';

interface Props {
    state: FlowState;
    onUpdate: (data: Partial<PassengerFormData>) => void;
}

export default function StepPassengerDetails({ state, onUpdate }: Props) {
    const { passenger: p, errors } = state;

    return (
        <div className="booking-step">
            <div className="booking-step__header">
                <h3>Passenger Details</h3>
                <p>Your identity details are used to issue your e-ticket</p>
            </div>

            <div className="booking-form-grid">
                <Input
                    label="First Name"
                    placeholder="e.g. Faraz"
                    value={p.firstName}
                    error={errors.firstName}
                    onChange={e => onUpdate({ firstName: e.target.value })}
                    autoComplete="given-name"
                    fullWidth
                    leftIcon={
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                    }
                />
                <Input
                    label="Last Name"
                    placeholder="e.g. Bajeer"
                    value={p.lastName}
                    error={errors.lastName}
                    onChange={e => onUpdate({ lastName: e.target.value })}
                    autoComplete="family-name"
                    fullWidth
                    leftIcon={
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                    }
                />
                <Input
                    label="Phone Number"
                    placeholder="03xxxxxxxxx"
                    value={p.phone}
                    error={errors.phone}
                    type="tel"
                    onChange={e => onUpdate({ phone: e.target.value })}
                    autoComplete="tel"
                    fullWidth
                    leftIcon={
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.41 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
                        </svg>
                    }
                />
                <Input
                    label="CNIC (optional)"
                    placeholder="12345-1234567-1"
                    value={p.cnic}
                    error={errors.cnic}
                    onChange={e => onUpdate({ cnic: e.target.value })}
                    fullWidth
                    hint="Required for full booking manifest"
                />
                <Input
                    label="Email (optional)"
                    placeholder="you@example.com"
                    value={p.email}
                    error={errors.email}
                    type="email"
                    onChange={e => onUpdate({ email: e.target.value })}
                    autoComplete="email"
                    fullWidth
                    style={{ gridColumn: '1 / -1' }}
                    leftIcon={
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                        </svg>
                    }
                    hint="E-ticket will be sent here"
                />
            </div>
        </div>
    );
}
