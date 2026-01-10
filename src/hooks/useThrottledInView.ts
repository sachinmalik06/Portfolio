import { useEffect, useRef, useState } from 'react';

interface UseThrottledInViewOptions {
  threshold?: number;
  cooldownMs?: number;
}

/**
 * Hook to control animation triggering with a cooldown period
 * Prevents rapid re-animations during quick scrolling
 */
export function useThrottledInView(
  options: UseThrottledInViewOptions = {}
) {
  const { threshold = 0.2, cooldownMs = 2000 } = options;
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const lastAnimationTime = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const now = Date.now();
          const timeSinceLastAnimation = now - lastAnimationTime.current;

          // Only allow animation if cooldown period has passed
          if (timeSinceLastAnimation >= cooldownMs || lastAnimationTime.current === 0) {
            setShouldAnimate(true);
            lastAnimationTime.current = now;
          } else {
            setShouldAnimate(false);
          }
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, cooldownMs]);

  return { ref: elementRef, shouldAnimate };
}
