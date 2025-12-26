import { preloadImages, preloadFonts, clamp, map } from '../utils';
import Cursor from '../cursor';
import LocomotiveScroll from 'locomotive-scroll';

// Initialize Locomotive Scroll (horizontal direction)
const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;

if (!scrollContainer) {
    throw new Error('Scroll container not found');
}

const lscroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    direction: 'horizontal'
});

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

lscroll.update();

// Preload images and fonts
Promise.all([preloadImages('.gallery__item-imginner'), preloadFonts('vxy2fer')]).then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');

    // Initialize custom cursor
    const cursorElement = document.querySelector('.cursor') as HTMLElement;
    if (cursorElement) {
        const cursor = new Cursor(cursorElement);

        // Mouse effects on all links and others
        [...document.querySelectorAll('a')].forEach((link: Element) => {
            link.addEventListener('mouseenter', () => cursor.enter());
            link.addEventListener('mouseleave', () => cursor.leave());
        });
    }
});

