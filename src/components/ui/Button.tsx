/* ─────────────────────────────────────────────────────────────
   Button.tsx — venService v2.0
   Enterprise-grade button: loading state, size system,
   icon slots, ref-forwarding, full accessibility.
   ───────────────────────────────────────────────────────────── */

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'ghost' | 'green' | 'danger' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

// ── Variant → CSS class map ────────────────────────────────────

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  ghost: 'btn btn-ghost',
  green: 'btn btn-green',
  danger: 'btn btn-danger',
  outline: 'btn btn-ghost',   // alias
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

// ── Spinner ────────────────────────────────────────────────────

const ButtonSpinner: React.FC = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
    style={{
      animation: 'spin 0.7s linear infinite',
    }}
  >
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.25} />
    <path d="M21 12a9 9 0 00-9-9" />
  </svg>
);

if (!document.getElementById('btn-spin-keyframes')) {
  const style = document.createElement('style');
  style.id = 'btn-spin-keyframes';
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}

// ── Component ──────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    className = '',
    ...rest
  },
  ref
) {
  const classes = [
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      {...rest}
    >
      {loading ? (
        <ButtonSpinner />
      ) : leftIcon ? (
        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
          {leftIcon}
        </span>
      ) : null}

      {children && <span>{children}</span>}

      {!loading && rightIcon && (
        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
