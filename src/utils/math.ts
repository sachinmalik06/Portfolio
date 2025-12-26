// @ts-ignore - imagesloaded doesn't have types
import imagesLoaded from 'imagesloaded';

// Type declaration for WebFont
declare global {
    interface Window {
        WebFont: {
            load: (config: {
                typekit: { id: string };
                active: () => void;
            }) => void;
        };
    }
}

// Map number x from range [a, b] to [c, d]
export const map = (x: number, a: number, b: number, c: number, d: number): number => {
    return (x - a) * (d - c) / (b - a) + c;
};

// Linear interpolation
export const lerp = (a: number, b: number, n: number): number => {
    return (1 - n) * a + n * b;
};

export const clamp = (num: number, min: number, max: number): number => {
    return num <= min ? min : num >= max ? max : num;
};

export const randomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Gets the mouse position
export const getMousePos = (e: MouseEvent): { x: number; y: number } => {
    return { 
        x: e.clientX, 
        y: e.clientY 
    };
};

// Preload images
export const preloadImages = (selector: string = 'img'): Promise<void> => {
    return new Promise((resolve) => {
        imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
    });
};

// Preload fonts (optional - can be skipped if not using Typekit)
export const preloadFonts = (id: string): Promise<void> => {
    return new Promise((resolve) => {
        if (window.WebFont && window.WebFont.load) {
            window.WebFont.load({
                typekit: {
                    id: id
                },
                active: resolve
            });
        } else {
            // If WebFont is not available, resolve immediately
            resolve();
        }
    });
};

