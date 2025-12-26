import { useEffect, useRef } from 'react';
// @ts-ignore - locomotive-scroll doesn't have types
import LocomotiveScroll from 'locomotive-scroll';
import { clamp, map, preloadImages } from '@/utils/math';
import useCursor from './Cursor';

interface LocomotiveScrollGalleryProps {
  scrollContainer: HTMLElement | null;
  cursorElement: HTMLElement | null;
  onLoaded?: () => void;
}

export default function useLocomotiveScrollGallery({
  scrollContainer,
  cursorElement,
  onLoaded,
}: LocomotiveScrollGalleryProps) {
  const lscrollRef = useRef<LocomotiveScroll | null>(null);
  const cursor = useCursor({ element: cursorElement });

  useEffect(() => {
    if (!scrollContainer) return;

    // Initialize Locomotive Scroll (horizontal direction)
    // Configure to work within a pinned GSAP ScrollTrigger container
    // Note: Locomotive Scroll will handle horizontal scrolling within the gallery
    // while GSAP ScrollTrigger remains pinned
    const lscroll = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      direction: 'horizontal',
      multiplier: 1,
      class: 'has-scroll-smooth',
      scrollbarContainer: scrollContainer, // Use the scroll container for scrollbar
    });
    lscrollRef.current = lscroll;

    // Handle scroll events for image filter effects
    lscroll.on('scroll', (obj: { currentElements: Record<string, { el: HTMLElement; progress: number }> }) => {
      for (const key of Object.keys(obj.currentElements)) {
        const element = obj.currentElements[key];
        if (element.el.classList.contains('gallery__item-imginner')) {
          const progress: number = element.progress;
          const saturateVal = progress < 0.5 
            ? clamp(map(progress, 0, 0.5, 0, 1), 0, 1) 
            : clamp(map(progress, 0.5, 1, 1, 0), 0, 1);
          const brightnessVal = progress < 0.5 
            ? clamp(map(progress, 0, 0.5, 0, 1), 0, 1) 
            : clamp(map(progress, 0.5, 1, 1, 0), 0, 1);
          element.el.style.filter = `saturate(${saturateVal}) brightness(${brightnessVal})`;
        }
      }
    });

    // Update Locomotive Scroll after initialization
    setTimeout(() => {
      lscroll.update();
    }, 100);

    // Preload images
    preloadImages('.gallery__item-imginner').then(() => {
      // Remove loader (loading class)
      document.body.classList.remove('loading');
      
      if (onLoaded) {
        onLoaded();
      }

      // Setup cursor hover effects on links
      if (cursorElement) {
        const links = scrollContainer.querySelectorAll('a');
        links.forEach((link) => {
          link.addEventListener('mouseenter', () => cursor.enter());
          link.addEventListener('mouseleave', () => cursor.leave());
        });
      }
    });

    // Cleanup
    return () => {
      if (lscrollRef.current) {
        lscrollRef.current.destroy();
        lscrollRef.current = null;
      }
    };
  }, [scrollContainer, cursorElement, onLoaded, cursor]);

  return {
    update: () => {
      if (lscrollRef.current) {
        lscrollRef.current.update();
      }
    },
    scrollTo: (target: string | number) => {
      if (lscrollRef.current) {
        lscrollRef.current.scrollTo(target);
      }
    },
  };
}

