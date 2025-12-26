import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Text elements with their initial and alternate positions (matching the original structure)
const textItems = [
  { text: 'STRATEGY', pos: 'pos-4', altPos: 'pos-2' },
  { text: 'LEADERSHIP', pos: 'pos-1', altPos: 'pos-3' },
  { text: 'EXECUTION', pos: 'pos-2', altPos: 'pos-5' },
  { text: 'INNOVATION', pos: 'pos-3', altPos: 'pos-2' },
  { text: 'CREATIVE', pos: 'pos-1', altPos: 'pos-4' },
  { text: 'VISION', pos: 'pos-2', altPos: 'pos-9' },
  { text: 'DESIGN', pos: 'pos-3', altPos: 'pos-5' },
  { text: 'BRAND', pos: 'pos-4', altPos: 'pos-3' },
  { text: 'MOTION', pos: 'pos-2', altPos: 'pos-4' },
  { text: 'STUDIO', pos: 'pos-3', altPos: 'pos-6' },
  { text: 'CINEMATIC', pos: 'pos-1', altPos: 'pos-3' },
  { text: 'NARRATIVE', pos: 'pos-2', altPos: 'pos-7' },
];

interface ScrollTextMotionProps {
  isActive: boolean;
}

export default function ScrollTextMotion({ isActive }: ScrollTextMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Wait for next frame to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const elements = elementsRef.current.filter(Boolean);
      if (elements.length === 0) return;

      if (!isActive) {
        // Kill all animations when inactive
        timelinesRef.current.forEach(tl => tl.kill());
        timelinesRef.current = [];
        // Hide elements when inactive
        elements.forEach(el => {
          gsap.set(el, { opacity: 0 });
        });
        return;
      }

      // Show elements when active
      elements.forEach(el => {
        gsap.set(el, { opacity: 0.6 });
      });

      // Kill existing animations
      timelinesRef.current.forEach(tl => tl.kill());
      timelinesRef.current = [];

      // Reset elements to their initial state
      elements.forEach((el, index) => {
        const item = textItems[index];
        if (!item) return;

        // Clear any transforms
        gsap.set(el, {
          clearProps: 'transform,opacity,filter',
          x: 0,
          y: 0,
        });

        // Set initial classes
        el.className = `scroll-text-el ${item.pos}`;
      });

      // Create looping animations for each element using the exact Flip-like motion
    elements.forEach((el, index) => {
      const item = textItems[index];
      if (!item) return;

      const originalClass = item.pos;
      const targetClass = item.altPos;
      const flipEase = 'expo.inOut';

      // Create a looping timeline
      const tl = gsap.timeline({ repeat: -1, delay: index * 0.3 });

      // Helper function to capture position when element has a specific class
      const capturePosition = (posClass: string) => {
        // Ensure element has the class
        const hadClass = el.classList.contains(posClass);
        if (!hadClass) {
          el.classList.add(posClass);
        }
        
        // Force reflow
        void el.offsetHeight;
        
        const rect = el.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        const position = {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          opacity: parseFloat(computedStyle.opacity),
          filter: computedStyle.filter,
        };

        // Restore if we added the class
        if (!hadClass) {
          el.classList.remove(posClass);
        }

        return position;
      };

      // Capture initial position
      el.classList.remove(targetClass);
      el.classList.add(originalClass);
      gsap.set(el, { clearProps: 'transform' });
      const initialPos = capturePosition(originalClass);
      
      // Capture target position
      const targetPos = capturePosition(targetClass);

      // Calculate delta
      const deltaX = targetPos.x - initialPos.x;
      const deltaY = targetPos.y - initialPos.y;

      // Animate to target (matching Flip.to behavior)
      tl.to(el, {
        x: deltaX,
        y: deltaY,
        opacity: targetPos.opacity,
        filter: targetPos.filter,
        ease: flipEase,
        duration: 2 + Math.random() * 1,
        onStart: () => {
          el.classList.remove(originalClass);
          el.classList.add(targetClass);
        }
      });

      // Animate back to original (matching Flip.from behavior)
      tl.to(el, {
        x: 0,
        y: 0,
        opacity: initialPos.opacity,
        filter: initialPos.filter,
        ease: flipEase,
        duration: 2 + Math.random() * 1,
        onStart: () => {
          el.classList.remove(targetClass);
          el.classList.add(originalClass);
        }
      }, '+=0.5');

      timelinesRef.current.push(tl);
    });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      timelinesRef.current.forEach(tl => tl.kill());
      timelinesRef.current = [];
    };
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className="scroll-text-motion fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        opacity: isActive ? 0.2 : 0,
        visibility: isActive ? 'visible' : 'hidden',
      }}
    >
      {textItems.map((item, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) elementsRef.current[index] = el;
          }}
          className={`scroll-text-el ${item.pos}`}
          style={{
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            fontSize: 'clamp(1.5rem, 4vw, 4rem)',
            fontFamily: 'inherit',
            fontWeight: 400,
            color: 'var(--foreground)',
            opacity: 0.6,
            filter: 'blur(0px)',
            willChange: 'transform, filter',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
