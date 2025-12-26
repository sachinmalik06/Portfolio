# Integration Prompt for AI Assistant

Use this prompt when you want to integrate the Horizontal Smooth Scroll Layout (Demo 5) into your main website:

---

## Prompt Text:

"I have a Horizontal Smooth Scroll Layout feature (Demo 5) that I want to integrate into my website. Here's what needs to be done:

**Files to integrate:**
1. Copy all TypeScript files from `src/js/` folder:
   - `src/js/utils.ts` - Utility functions (map, lerp, clamp, preloadImages, preloadFonts)
   - `src/js/cursor.ts` - Custom cursor class
   - `src/js/demo5/index.ts` - Main demo logic with Locomotive Scroll

2. Copy CSS files from `src/css/` folder:
   - `src/css/base.css` - Base styles
   - `src/css/demo5.css` - Demo 5 specific styles

3. Copy images from `src/img/demo1/` folder (or replace with my own images)

**Dependencies to install:**
- `locomotive-scroll` (^4.0.6)
- `gsap` (^3.5.1)
- `imagesloaded` (^4.1.4)
- `ev-emitter` (^2.1.2)
- TypeScript dev dependencies: `typescript`, `@types/node`, `@types/imagesloaded`, `@types/locomotive-scroll`

**HTML Structure Required:**
- A container with `data-scroll-container` attribute
- Elements with class `gallery__item-imginner` for the scroll effects
- A cursor element with class `cursor` (SVG circle)
- Body should have `loading` class initially (removed after preload)

**Integration Steps:**
1. Install all required dependencies
2. Copy the TypeScript files to my project's source directory
3. Copy the CSS files and import them appropriately
4. Update my HTML to include the required structure and classes
5. Import and initialize the demo in my main TypeScript/JavaScript entry point
6. Ensure the build system (Webpack/Vite/Parcel) is configured to handle TypeScript
7. Make sure the CSS classes match the HTML structure I'm using

**Key Features:**
- Horizontal smooth scrolling using Locomotive Scroll
- Image saturation and brightness effects on scroll
- Custom cursor that scales on hover
- Image and font preloading
- TypeScript with full type safety

Please integrate this feature into my website, adapting it to work with my existing codebase structure and styling conventions."

---

## Alternative Shorter Prompt:

"Integrate the Horizontal Smooth Scroll Layout (Demo 5) from the `src/js/`, `src/css/`, and `src/img/` folders into my website. Install dependencies (locomotive-scroll, gsap, imagesloaded, ev-emitter), copy the TypeScript files, CSS files, and images. Update my HTML with the required structure (`data-scroll-container`, `gallery__item-imginner`, `.cursor`). Initialize the scroll in my main entry point. Ensure TypeScript compilation is set up."

---

## What the AI/Developer Will Need:

1. **Access to your codebase structure** - So they know where to place files
2. **Your build system** - Webpack, Vite, Parcel, etc.
3. **Your styling approach** - To adapt CSS if needed
4. **Your TypeScript config** - Or they'll set it up
5. **Your HTML structure** - To integrate the required elements

---

## Quick Checklist for Integration:

- [ ] Dependencies installed
- [ ] TypeScript files copied and imported
- [ ] CSS files copied and imported
- [ ] Images copied or replaced
- [ ] HTML structure updated with required classes/attributes
- [ ] Main entry point updated to initialize the scroll
- [ ] Build system configured for TypeScript
- [ ] Tested and working

