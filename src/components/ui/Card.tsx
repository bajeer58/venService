/* ─────────────────────────────────────────────────────────────
   Card.tsx — venService v2.0
   Variants: elevated, outlined, glass
   Slot pattern: header / body / footer
   Animation is caller's responsibility.
   ───────────────────────────────────────────────────────────── */

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

// ── Types ──────────────────────────────────────────────────────

export type CardVariant = 'elevated' | 'outlined' | 'glass';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  /** Card header slot — rendered above body with a bottom border */
  header?: React.ReactNode;
  /** Card footer slot — rendered below body with a top border */
  footer?: React.ReactNode;
  /** @deprecated pass className or style directly */
  delay?: number;
  className?: string;
  padding?: string | number;
}

// ── Variant styles ─────────────────────────────────────────────

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

// ── Slot sub-components ────────────────────────────────────────

function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}
    >
      {children}
    </div>
  );
}

function CardBody({ children, padding }: { children: React.ReactNode; padding?: string | number }) {
  return (
    <div style={{ padding: padding ?? 'var(--space-5)' }}>
      {children}
    </div>
  );
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--space-4) var(--space-5)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 'var(--space-3)',
      }}
    >
      {children}
    </div>
  );
}

// ── Main Card component ────────────────────────────────────────

function Card({
  children,
  variant = 'elevated',
  hoverable = true,
  header,
  footer,
  delay,        // consumed so it won't be spread to DOM
  padding,
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
      onKeyDown={
        onClick
          ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
          }
          : undefined
      }
      {...rest}
    >
      {header && <CardHeader>{header}</CardHeader>}

      {/* If header/footer slots used, wrap children in CardBody */}
      {(header || footer) ? (
        <CardBody padding={padding}>{children}</CardBody>
      ) : (
        children
      )}

      {footer && <CardFooter>{footer}</CardFooter>}
    </motion.div>
  );
}

// Expose sub-components as named exports for direct use
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
