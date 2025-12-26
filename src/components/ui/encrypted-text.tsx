import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  text: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
  className?: string;
  animate?: boolean;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export function EncryptedText({
  text,
  encryptedClassName = "text-muted-foreground",
  revealedClassName = "text-foreground",
  revealDelayMs = 50,
  className,
  animate = true,
}: EncryptedTextProps) {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const hasStarted = useRef(false);
  const revealedIndicesRef = useRef<Set<number>>(new Set());
  const lastUpdateTime = useRef<number>(0);
  const textArrayRef = useRef<string[]>([]);
  const previousAnimateRef = useRef<boolean | undefined>(undefined);

  const getRandomChar = useCallback(() => {
    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }, []);

  // Optimized animation loop using requestAnimationFrame
  const animateChars = useCallback(() => {
    const now = performance.now();
    // Throttle updates to ~60fps (every ~16ms)
    if (now - lastUpdateTime.current < 16) {
      animationFrameRef.current = requestAnimationFrame(animateChars);
      return;
    }
    lastUpdateTime.current = now;

    setDisplayText((prev) => {
      const newText = prev.map((char, index) => {
        if (revealedIndicesRef.current.has(index) || textArrayRef.current[index] === " ") {
          return textArrayRef.current[index];
        }
        return getRandomChar();
      });
      return newText;
    });

    animationFrameRef.current = requestAnimationFrame(animateChars);
  }, [getRandomChar]);

  useEffect(() => {
    // Cleanup function
    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      hasStarted.current = false;
      revealedIndicesRef.current = new Set();
    };

    // Initialize text array ref
    const initialText = text.split("");
    textArrayRef.current = initialText;

    // Initialize display text if empty (first mount)
    if (displayText.length === 0 && initialText.length > 0) {
      setDisplayText(initialText.map((char) => (char === " " ? " " : getRandomChar())));
    }

    // Track animate changes to allow restart
    const isFirstMount = previousAnimateRef.current === undefined;
    const previousAnimate = previousAnimateRef.current;
    const animateChanged = !isFirstMount && previousAnimate !== animate;
    const changedFromFalseToTrue = animateChanged && previousAnimate === false && animate === true;
    
    // Update ref for next render
    previousAnimateRef.current = animate;

    if (!animate) {
      // Cleanup and reset when not animating
      cleanup();
      // Reset to initial scrambled state when not animating
      if (displayText.length !== initialText.length) {
        setDisplayText(initialText.map((char) => (char === " " ? " " : getRandomChar())));
      }
      setRevealedIndices(new Set());
      return cleanup;
    }

    // Determine if we should start/restart animation
    // Start if: first mount with animate=true, or animate changed from false to true, or not started yet
    const shouldStart = (isFirstMount && animate) || changedFromFalseToTrue || !hasStarted.current;

    if (!shouldStart) {
      // Already started and shouldn't restart
      return cleanup;
    }

    // Reset and start animation
    cleanup(); // Clean up any existing animation first
    hasStarted.current = true;

    // Initialize with scrambled text
    const initialDisplay = initialText.map((char) => (char === " " ? " " : getRandomChar()));
    setDisplayText(initialDisplay);
    revealedIndicesRef.current = new Set();
    lastUpdateTime.current = performance.now();

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animateChars);

    // Schedule character reveals
    initialText.forEach((_, index) => {
      const timeout = setTimeout(() => {
        revealedIndicesRef.current.add(index);
        setRevealedIndices(new Set(revealedIndicesRef.current));
      }, index * revealDelayMs);
      timeoutRefs.current.push(timeout);
    });

    // Final cleanup - ensure all characters are revealed
    const totalTime = initialText.length * revealDelayMs + 500;
    const finalTimeout = setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setDisplayText(initialText);
      setRevealedIndices(new Set(initialText.map((_, i) => i)));
    }, totalTime);
    timeoutRefs.current.push(finalTimeout);

    return cleanup;
  }, [text, revealDelayMs, animate, getRandomChar, animateChars]);

  return (
    <span className={cn("font-mono", className)}>
      {displayText.map((char, index) => (
        <span
          key={index}
          className={cn(
            "transition-colors duration-300",
            revealedIndices.has(index) ? revealedClassName : encryptedClassName
          )}
        >
          {char}
        </span>
      ))}
    </span>
  );
}