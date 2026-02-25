/* ─────────────────────────────────────────────
   Badge.tsx — venService v2.0
   Full variant system with optional dot pulse.
   ───────────────────────────────────────────── */

import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'green' | 'amber' | 'red' | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  /** @deprecated use variant */
  color?: 'green' | 'amber' | 'red';
  variant?: BadgeVariant;
  dot?: boolean;     // animated pulse dot
  pulse?: boolean;     // alias for dot
  className?: string;
}

const VARIANT_MAP: Record<BadgeVariant, string> = {
  default: 'badge badge-muted',
  success: 'badge badge-green',
  green: 'badge badge-green',
  warning: 'badge badge-amber',
  amber: 'badge badge-amber',
  danger: 'badge badge-red',
  red: 'badge badge-red',
  info: 'badge badge-blue',
  blue: 'badge badge-blue',
};

// Legacy color → variant mapping
const LEGACY_COLOR_MAP = {
  green: 'success',
  amber: 'warning',
  red: 'danger',
} as const;

export default function Badge({
  children,
  color,
  variant,
  dot = false,
  pulse = false,
  className = '',
}: BadgeProps) {
  // Resolve variant: explicit variant > legacy color prop > default
  const resolvedVariant: BadgeVariant = variant
    ?? (color ? LEGACY_COLOR_MAP[color] : 'default');

  const classes = [VARIANT_MAP[resolvedVariant], className].filter(Boolean).join(' ');
  const showDot = dot || pulse;

  return (
    <span className={classes} aria-label={typeof children === 'string' ? children : undefined}>
      {showDot && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            animation: 'pulse-dot 1.5s ease-in-out infinite',
          }}
        />
      )}
      {children}
    </span>
  );
}
