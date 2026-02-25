/* ─────────────────────────────────────────────
   Spinner.tsx — venService v2.0
   Accessible loading indicator.
   ───────────────────────────────────────────── */

import React from 'react';

interface SpinnerProps {
    size?: number;
    color?: string;
    label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
    size = 20,
    color = 'var(--color-primary)',
    label = 'Loading…',
}) => (
    <span
        role="status"
        aria-label={label}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
            style={{ animation: 'spin 0.75s linear infinite' }}
        >
            <circle cx="12" cy="12" r="9" strokeOpacity={0.2} />
            <path d="M21 12a9 9 0 00-9-9" />
        </svg>
        <span className="sr-only">{label}</span>
    </span>
);

export default Spinner;
