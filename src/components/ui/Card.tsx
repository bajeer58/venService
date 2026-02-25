/* ─────────────────────────────────────────────
   Card.tsx — venService v2.0
   Variants: elevated, outlined, glass
   Animation is caller's responsibility.
   ───────────────────────────────────────────── */

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type CardVariant = 'elevated' | 'outlined' | 'glass';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  /** @deprecated pass a className or style instead */
  delay?: number;
  className?: string;
}

const VARIANT_STYLES: Record<CardVariant, React.CSSProperties> = {
  elevated: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-card)',
  },
  outlined: {
    background: 'transparent',
    border: '1px solid var(--border)',
    boxShadow: 'none',
  },
  glass: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },
};

export default function Card({
  children,
  variant = 'elevated',
  hoverable = true,
  delay,       // consumed so it's not spread to DOM
  className = '',
  style,
  onClick,
  ...rest
}: CardProps) {
  const baseStyle = {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    position: 'relative',
    cursor: onClick ? 'pointer' : 'default',
    ...VARIANT_STYLES[variant],
    ...style,
  } as React.CSSProperties;

  return (
    <motion.div
      className={className}
      style={baseStyle}
      onClick={onClick}
      whileHover={hoverable && onClick ? { y: -3, boxShadow: 'var(--shadow-lg)' } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e as unknown as React.MouseEvent<HTMLDivElement>); } } : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
