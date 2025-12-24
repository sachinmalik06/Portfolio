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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStarted = useRef(false);
  const revealedIndicesRef = useRef<Set<number>>(new Set());

  const getRandomChar = useCallback(() => {
    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }, []);

  useEffect(() => {
    if (!animate) {
      // Reset to initial scrambled state when not animating
      setDisplayText(text.split("").map((char) => (char === " " ? " " : getRandomChar())));
      setRevealedIndices(new Set());
      revealedIndicesRef.current = new Set();
      hasStarted.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    if (hasStarted.current) return;
    hasStarted.current = true;

    // Initialize with random characters, scramble, then reveal one by one
    const initialDisplay = text.split("").map((char) => (char === " " ? " " : getRandomChar()));
    setDisplayText(initialDisplay);
    revealedIndicesRef.current = new Set();

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        prev.map((char, index) => {
          if (revealedIndicesRef.current.has(index) || text[index] === " ") return text[index];
          return getRandomChar();
        })
      );
    }, 50);

    text.split("").forEach((_, index) => {
      setTimeout(() => {
        revealedIndicesRef.current.add(index);
        setRevealedIndices(new Set(revealedIndicesRef.current));
      }, index * revealDelayMs);
    });

    const totalTime = text.length * revealDelayMs + 500;
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText(text.split(""));
    }, totalTime);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, revealDelayMs, animate, getRandomChar]);

  // Update display text when revealed indices change (but only if we have the same length)
  useEffect(() => {
    if (displayText.length === text.length) {
      setDisplayText((prev) =>
        prev.map((char, index) => (revealedIndices.has(index) ? text[index] : char))
      );
    }
  }, [revealedIndices, text, displayText.length]);

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