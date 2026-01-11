"use client";
import {
  useScroll,
  useTransform,
  motion,
  useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  yearStyles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  titleStyles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  contentStyles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Recalculate height when data changes or on resize
  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    updateHeight();
    
    // Update on resize
    window.addEventListener('resize', updateHeight);
    
    // Update when content loads (images, etc.)
    const timeoutId = setTimeout(updateHeight, 100);
    
    // Use ResizeObserver for better accuracy
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [data, ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  // Use spring for smoother animation
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothScrollProgress = useSpring(scrollYProgress, springConfig);

  const heightTransform = useTransform(
    smoothScrollProgress,
    [0, 1],
    [0, height],
    { clamp: false }
  );
  const opacityTransform = useTransform(
    smoothScrollProgress,
    [0, 0.1],
    [0, 1],
    { clamp: true }
  );

  return (
    <div
      className="w-full bg-background font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-foreground max-w-4xl font-display">
          Changelog from My Journey
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-sm">
          I&apos;ve been working on my craft for the past years. Here&apos;s
          a timeline of my journey.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-muted border border-border p-2" />
              </div>
              <h3 
                className={`hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-muted-foreground text-${item.yearStyles?.fontSize || '5xl'} font-${item.yearStyles?.fontWeight || 'bold'}`}
                style={item.yearStyles?.color ? { color: item.yearStyles.color } : {}}
              >
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 
                className={`md:hidden block text-2xl mb-4 text-left font-bold text-muted-foreground text-${item.yearStyles?.fontSize || '2xl'} font-${item.yearStyles?.fontWeight || 'bold'}`}
                style={item.yearStyles?.color ? { color: item.yearStyles.color } : {}}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-muted to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary/50 to-transparent from-[0%] via-[10%] rounded-full will-change-[height,opacity]"
          />
        </div>
      </div>
    </div>
  );
};
