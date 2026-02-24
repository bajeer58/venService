/* ─────────────────────────────────────────────
   Loading skeleton placeholder with pulse animation.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  count?: number;
}

function SkeletonLine({ width = '100%', height = 16, borderRadius = 8 }: Omit<SkeletonProps, 'count'>) {
  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%)',
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export default function LoadingSkeleton({ width, height, borderRadius, count = 1 }: SkeletonProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLine key={i} width={width} height={height} borderRadius={borderRadius} />
      ))}
    </div>
  );
}
