# TypeScript Integration Guide

This project has been converted to TypeScript for easy integration into other websites.

## Project Structure

```
src/
├── index.html          # Main HTML file
├── css/
│   ├── base.css        # Base styles
│   └── demo5.css       # Demo 5 specific styles
├── js/
│   ├── utils.ts        # Utility functions (map, lerp, clamp, etc.)
│   ├── cursor.ts       # Custom cursor class
│   └── demo5/
│       └── index.ts    # Main demo logic
└── img/
    └── demo1/          # Images used by the demo
```

## Key TypeScript Files

### `src/js/utils.ts`
Utility functions including:
- `map()` - Map a value from one range to another
- `lerp()` - Linear interpolation
- `clamp()` - Clamp a number between min and max
- `preloadImages()` - Preload images
- `preloadFonts()` - Preload fonts

### `src/js/cursor.ts`
Custom cursor class with:
- `enter()` - Scale up cursor on hover
- `leave()` - Reset cursor size

### `src/js/demo5/index.ts`
Main demo logic:
- Initializes Locomotive Scroll with horizontal direction
- Handles scroll events for image effects
- Preloads images and fonts
- Initializes custom cursor

## Dependencies

- `locomotive-scroll` - Smooth scrolling library
- `gsap` - Animation library
- `imagesloaded` - Image loading utility

## TypeScript Configuration

The project uses `tsconfig.json` with:
- Strict type checking enabled
- ES2020 target
- ESNext modules
- DOM library support

## Integration Steps

1. Copy the TypeScript files (`src/js/*.ts`) to your project
2. Copy the CSS files (`src/css/*.css`) to your project
3. Install dependencies:
   ```bash
   npm install locomotive-scroll gsap imagesloaded
   npm install -D typescript @types/node @types/imagesloaded @types/locomotive-scroll
   ```
4. Ensure your build tool (Parcel, Webpack, etc.) is configured to handle TypeScript
5. Import and use the components in your TypeScript files

## Usage Example

```typescript
import { preloadImages, preloadFonts } from './utils';
import Cursor from './cursor';
import LocomotiveScroll from 'locomotive-scroll';

// Initialize scroll
const lscroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    direction: 'horizontal'
});

// Preload and initialize
Promise.all([
    preloadImages('.gallery__item-imginner'),
    preloadFonts('vxy2fer')
]).then(() => {
    const cursor = new Cursor(document.querySelector('.cursor'));
    // Your initialization code
});
```

