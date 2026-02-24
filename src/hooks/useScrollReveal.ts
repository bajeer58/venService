/* ─────────────────────────────────────────────
   Intersection Observer hook for scroll reveal.
   Returns a ref to attach to the target element.
   ───────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';

/**
 * Observe an element and return true when it enters the viewport.
 * Once visible, it stays visible (no un-reveal).
 */
export function useScrollReveal(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // Stop observing once visible
        }
      },
      { threshold },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
