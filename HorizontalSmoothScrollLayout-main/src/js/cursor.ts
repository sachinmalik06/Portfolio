import { gsap } from 'gsap';
import { lerp, getMousePos } from './utils';

// Track the mouse position
let mouse: { x: number; y: number } = { x: 0, y: 0 };
window.addEventListener('mousemove', (ev: MouseEvent) => mouse = getMousePos(ev));

interface RenderedStyle {
    previous: number;
    current: number;
    amt: number;
}

interface RenderedStyles {
    tx: RenderedStyle;
    ty: RenderedStyle;
    scale: RenderedStyle;
}

export default class Cursor {
    private DOM: { el: HTMLElement };
    private bounds: DOMRect;
    private renderedStyles: RenderedStyles;
    private onMouseMoveEv: () => void;

    constructor(el: HTMLElement | null) {
        if (!el) {
            throw new Error('Cursor element not found');
        }
        
        this.DOM = { el: el };
        this.DOM.el.style.opacity = '0';
        
        this.bounds = this.DOM.el.getBoundingClientRect();
        
        this.renderedStyles = {
            tx: { previous: 0, current: 0, amt: 0.2 },
            ty: { previous: 0, current: 0, amt: 0.2 },
            scale: { previous: 1, current: 1, amt: 0.15 },
        };

        this.onMouseMoveEv = () => {
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.x - this.bounds.width / 2;
            this.renderedStyles.ty.previous = this.renderedStyles.ty.current = mouse.y - this.bounds.height / 2;
            gsap.to(this.DOM.el, { duration: 0.9, ease: 'Power3.easeOut', opacity: 1 });
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }

    enter(): void {
        this.renderedStyles.scale.current = 2.5;
    }

    leave(): void {
        this.renderedStyles.scale.current = 1;
    }

    private render(): void {
        this.renderedStyles.tx.current = mouse.x - this.bounds.width / 2;
        this.renderedStyles.ty.current = mouse.y - this.bounds.height / 2;

        for (const key in this.renderedStyles) {
            const style = this.renderedStyles[key as keyof RenderedStyles];
            style.previous = lerp(style.previous, style.current, style.amt);
        }
                    
        this.DOM.el.style.transform = `translateX(${this.renderedStyles.tx.previous}px) translateY(${this.renderedStyles.ty.previous}px) scale(${this.renderedStyles.scale.previous})`;

        requestAnimationFrame(() => this.render());
    }
}

