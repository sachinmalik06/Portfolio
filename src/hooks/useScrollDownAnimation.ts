import { useEffect, useRef, useState } from "react";

/**
 * Hook for animations that only trigger when scrolling down, not up
 * Allows re-animation every time element comes into view while scrolling down
 */
export function useScrollDownAnimation(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const lastScrollY = useRef(0);
  const isIntersecting = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Track intersection
    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY.current;
        
        isIntersecting.current = entry.isIntersecting;

        // Only trigger animation if:
        // 1. Element is entering viewport (isIntersecting)
        // 2. User is scrolling down
        if (entry.isIntersecting && scrollingDown) {
          setShouldAnimate(true);
        } else if (!entry.isIntersecting) {
          // Reset animation state when element leaves viewport
          setShouldAnimate(false);
        }

        lastScrollY.current = currentScrollY;
      },
      { threshold, rootMargin: "0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, shouldAnimate };
}
