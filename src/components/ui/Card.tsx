/* ─────────────────────────────────────────────
   Reusable Card component with hover elevation.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import type { ReactNode, MouseEventHandler } from 'react';

interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
  delay?: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function Card({
  children,
  hoverable = true,
  delay = 0,
  className = '',
  onClick,
}: CardProps) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={hoverable ? {
        y: -6,
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
        transition: { duration: 0.25 },
      } : {}}
    >
      {children}
    </motion.div>
  );
}
