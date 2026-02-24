/* ─────────────────────────────────────────────
   Animated counter hook — counts from 0 to target.
   Used for dashboard KPI cards and hero stats.
   ───────────────────────────────────────────── */

import { useState, useEffect, useRef } from 'react';

/**
 * Animate a number from 0 to `end` over `duration` ms.
 * Returns the current displayed value.
 */
export function useCountUp(end: number, duration = 1500, startOnMount = true): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!startOnMount) return;

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, startOnMount]);

  return count;
}
