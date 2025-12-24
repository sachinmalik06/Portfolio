import { forwardRef, useMemo, useRef, useEffect, RefObject } from 'react';
import { motion } from 'framer-motion';

function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

function useMousePositionRef(containerRef: RefObject<HTMLElement> | null) {
  const mousePosition = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef?.current) {
        mousePosition.current = { x: event.clientX, y: event.clientY };
        return;
      }
      // If containerRef is provided, we could track relative to it, 
      // but usually for this effect we want global mouse position 
      // and then calculate distance to the element's rect.
      mousePosition.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef]);

  return mousePosition;
}

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef: RefObject<HTMLElement> | null;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>(({
  label,
  fromFontVariationSettings = "'wght' 400, 'opsz' 9",
  toFontVariationSettings = "'wght' 900, 'opsz' 4",
  containerRef,
  radius = 100,
  falloff = 'linear',
  className = '',
  onClick,
  style,
}, ref) => {
  const mousePositionRef = useMousePositionRef(containerRef);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  const words = useMemo(() => label.split(' '), [label]);

  // Parse the variation settings into a map for easier interpolation
  // This is a simplified parser assuming format "'axis' value, 'axis' value"
  const parseSettings = (settings: string) => {
    const map = new Map<string, number>();
    settings.split(',').forEach(part => {
      const [axis, value] = part.trim().split(' ');
      if (axis && value) {
        map.set(axis.replace(/['"]/g, ''), parseFloat(value));
      }
    });
    return map;
  };

  const fromSettings = useMemo(() => parseSettings(fromFontVariationSettings), [fromFontVariationSettings]);
  const toSettings = useMemo(() => parseSettings(toFontVariationSettings), [toFontVariationSettings]);

  useAnimationFrame(() => {
    if (!letterRefs.current.length) return;

    const mouseX = mousePositionRef.current.x;
    const mouseY = mousePositionRef.current.y;

    letterRefs.current.forEach((letter, index) => {
      if (!letter) return;

      const rect = letter.getBoundingClientRect();
      const letterX = rect.left + rect.width / 2;
      const letterY = rect.top + rect.height / 2;

      const dist = Math.sqrt(
        Math.pow(mouseX - letterX, 2) + Math.pow(mouseY - letterY, 2)
      );

      let interpolation = 0;
      if (dist < radius) {
        const t = 1 - dist / radius;
        switch (falloff) {
          case 'exponential':
            interpolation = Math.pow(t, 2);
            break;
          case 'gaussian':
            interpolation = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(radius / 2, 2))); // Approximate
            break;
          case 'linear':
          default:
            interpolation = t;
            break;
        }
      }

      // Interpolate settings
      const currentSettings: string[] = [];
      fromSettings.forEach((startValue, axis) => {
        const endValue = toSettings.get(axis) ?? startValue;
        const currentValue = startValue + (endValue - startValue) * interpolation;
        currentSettings.push(`'${axis}' ${currentValue}`);
      });

      letter.style.fontVariationSettings = currentSettings.join(', ');
    });
  });

  let charRefIndex = 0;

  return (
    <span 
      ref={ref} 
      className={`${className} inline-block cursor-default`} 
      onClick={onClick}
      style={{ fontFamily: 'var(--font-variable)', ...style }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline' }}>
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => {
              const currentRefIndex = charRefIndex++;
              return (
                <motion.span
                  key={charIndex}
                  ref={(el) => { letterRefs.current[currentRefIndex] = el; }}
                  className="inline-block will-change-[font-variation-settings]"
                  aria-hidden="true"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 && (
            <motion.span
              ref={(el) => { letterRefs.current[charRefIndex++] = el; }}
              className="inline will-change-[font-variation-settings]"
              aria-hidden="true"
            >
              {' '}
            </motion.span>
          )}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';

export default VariableProximity;