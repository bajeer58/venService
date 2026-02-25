/* ─────────────────────────────────────────────────────────────
   StepPayment.tsx — Step 4
   Payment method selection + account number entry.
   ───────────────────────────────────────────────────────────── */

import { motion } from 'framer-motion';
import Input from '../../components/ui/Input';
import type { FlowState } from './useBookingFlow';
import type { PaymentFormData } from '../../types';

type Method = 'easypaisa' | 'jazzcash' | 'bank' | 'cash';

interface PaymentMethod {
    id: Method;
    label: string;
    icon: string;
    description: string;
    requiresAccount: boolean;
}

const METHODS: PaymentMethod[] = [
    { id: 'easypaisa', label: 'EasyPaisa', icon: '📱', description: 'Pay via mobile wallet', requiresAccount: true },
    { id: 'jazzcash', label: 'JazzCash', icon: '💳', description: 'Pay via JazzCash wallet', requiresAccount: true },
    { id: 'bank', label: 'Bank Transfer', icon: '🏦', description: 'Direct bank deposit', requiresAccount: true },
    { id: 'cash', label: 'Cash at Counter', icon: '💵', description: 'Pay on boarding', requiresAccount: false },
];

interface Props {
    state: FlowState;
    onUpdate: (data: Partial<PaymentFormData>) => void;
}

export default function StepPayment({ state, onUpdate }: Props) {
    const { payment: p, errors, selectedRoute } = state;
    const selectedMethod = METHODS.find(m => m.id === p.method)!;

    // Compute totals
    const price = selectedRoute?.price ?? 0;
    const fee = Math.round(price * 0.05);
    const total = price + fee;

    return (
        <div className="booking-step">
            <div className="booking-step__header">
                <h3>Payment</h3>
                <p>Choose your preferred payment method</p>
            </div>

            {/* Order summary */}
            <div className="booking-order-summary">
                <h4>Order Summary</h4>
                <div className="booking-order-summary__row">
                    <span>Route</span>
                    <span>{selectedRoute ? `${selectedRoute.from} → ${selectedRoute.to}` : '—'}</span>
                </div>
                <div className="booking-order-summary__row">
                    <span>Date</span>
                    <span>{state.selectedDate}</span>
                </div>
                <div className="booking-order-summary__row">
                    <span>Departure</span>
                    <span>{state.selectedTimeSlot?.time ?? '—'}</span>
                </div>
                <div className="booking-order-summary__row">
                    <span>Fare</span>
                    <span>Rs. {price.toLocaleString()}</span>
                </div>
                <div className="booking-order-summary__row">
                    <span>Service Fee (5%)</span>
                    <span>Rs. {fee.toLocaleString()}</span>
                </div>
                <div className="booking-order-summary__row booking-order-summary__row--total">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString()}</span>
                </div>
            </div>

            {/* Method selection */}
            <div className="booking-methods-grid">
                {METHODS.map((method, i) => {
                    const isSelected = p.method === method.id;
                    return (
                        <motion.button
                            key={method.id}
                            className={`booking-method ${isSelected ? 'selected' : ''}`}
                            onClick={() => onUpdate({ method: method.id, accountNumber: '' })}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            whileHover={{ y: -2 }}
                            aria-pressed={isSelected}
                        >
                            <span className="booking-method__icon">{method.icon}</span>
                            <span className="booking-method__label">{method.label}</span>
                            <span className="booking-method__desc">{method.description}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Account number input */}
            {selectedMethod.requiresAccount && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 'var(--space-5)' }}
                >
                    <Input
                        label={`${selectedMethod.label} Account / Reference`}
                        placeholder="e.g. 03xx-xxxxxxx or TXN123"
                        value={p.accountNumber}
                        error={errors.accountNumber}
                        onChange={e => onUpdate({ accountNumber: e.target.value })}
                        fullWidth
                        leftIcon={
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                            </svg>
                        }
                        hint={`Total to pay: Rs. ${total.toLocaleString()}`}
                    />
                </motion.div>
            )}
        </div>
    );
}
