/* ─────────────────────────────────────────────
   EmptyState.tsx — venService v2.0
   Reusable empty state with icon, text, action.
   ───────────────────────────────────────────── */

import React from 'react';
import Button from './Button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}) => (
    <div
        role="status"
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--space-16)',
            gap: 'var(--space-4)',
        }}
    >
        {icon && (
            <div
                aria-hidden="true"
                style={{
                    fontSize: 48,
                    opacity: 0.35,
                    marginBottom: 'var(--space-2)',
                    filter: 'grayscale(1)',
                }}
            >
                {icon}
            </div>
        )}
        <h3
            style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: 0,
            }}
        >
            {title}
        </h3>
        {description && (
            <p
                style={{
                    color: 'var(--muted)',
                    fontSize: 'var(--text-sm)',
                    maxWidth: 360,
                    margin: 0,
                    lineHeight: 1.6,
                }}
            >
                {description}
            </p>
        )}
        {actionLabel && onAction && (
            <Button
                variant="primary"
                size="sm"
                onClick={onAction}
                style={{ marginTop: 'var(--space-2)' }}
            >
                {actionLabel}
            </Button>
        )}
    </div>
);

export default EmptyState;
