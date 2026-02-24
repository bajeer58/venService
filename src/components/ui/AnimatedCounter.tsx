/* ─────────────────────────────────────────────
   Animated counter that counts up from 0.
   Used for hero stats and dashboard KPIs.
   ───────────────────────────────────────────── */

import { useCountUp } from '../../hooks/useCountUp';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({ value, suffix = '', duration = 1500 }: AnimatedCounterProps) {
  const [ref, isVisible] = useScrollReveal(0.3);
  const count = useCountUp(value, duration, isVisible);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}
