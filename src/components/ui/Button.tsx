/* ─────────────────────────────────────────────
   Reusable Button component.
   Supports primary, ghost, green, and danger variants.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import type { ReactNode, CSSProperties, MouseEventHandler } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'green' | 'danger';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  children: ReactNode;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

/** Map variants to existing CSS classes */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  ghost: 'btn btn-ghost',
  green: 'btn btn-green',
  danger: 'btn btn-danger',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  disabled,
  onClick,
  style,
}: ButtonProps) {
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <motion.button
      className={`${variantClasses[variant]} ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
