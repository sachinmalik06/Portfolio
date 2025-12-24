import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PixelatedCanvasProps {
  src: string;
  className?: string;
  pixelationFactor?: number; // Starting pixelation (e.g., 20)
}

export function PixelatedCanvas({ src, className, pixelationFactor = 30 }: PixelatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = "Anonymous";
    
    image.onload = () => {
      setIsLoaded(true);
      animate();
    };

    const animate = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Update progress
      setProgress((prev) => {
        if (prev >= 1) return 1;
        return prev + 0.01; // Speed of depixelation
      });

      const w = canvasRef.current.width = image.width;
      const h = canvasRef.current.height = image.height;

      // Calculate current pixel size based on progress
      // Progress 0 -> pixelationFactor
      // Progress 1 -> 1 (no pixelation)
      // We want it to settle at 1.
      
      // Let's use a ease-out for the pixelation
      // currentPixelSize = start + (end - start) * progress
      // But we want it to go from High to Low.
      // current = start * (1 - progress) + 1 * progress ?? No.
      
      // Let's just map progress 0..1 to Factor..1
      const currentFactor = Math.max(1, pixelationFactor * (1 - progress));
      
      // Turn off smoothing for pixel effect
      ctx.imageSmoothingEnabled = false;

      // Draw small
      const sw = w / currentFactor;
      const sh = h / currentFactor;
      
      // Draw image at small size
      ctx.drawImage(image, 0, 0, sw, sh);
      
      // Draw back at full size
      ctx.drawImage(canvasRef.current, 0, 0, sw, sh, 0, 0, w, h);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [src, progress]); // Re-run if progress changes? No, animate loop handles it. 
  // Actually the animate function closes over the state, so using state inside animate loop is tricky if defined this way.
  // Better to use a ref for progress or just rely on the loop.

  // Let's rewrite the animation loop to be self-contained
  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = "Anonymous";
    
    let p = 0;
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Increment progress
      p += 0.005; // Adjust speed here
      if (p > 1) p = 1;

      const w = canvas.width = 400; // Fixed width for resolution or match container?
      // Let's match aspect ratio of image but keep resolution manageable
      const aspect = image.width / image.height;
      const h = w / aspect;
      canvas.height = h;

      const size = Math.max(1, pixelationFactor * (1 - p));

      // 1. Draw scaled down
      const wScaled = w / size;
      const hScaled = h / size;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, wScaled, hScaled);

      // 2. Draw scaled up
      ctx.drawImage(canvas, 0, 0, wScaled, hScaled, 0, 0, w, h);

      if (p < 1) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    image.onload = () => {
      render();
    };

    return () => cancelAnimationFrame(animationFrameId);
  }, [src, pixelationFactor]);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn("w-full h-auto rounded-xl shadow-2xl border border-white/10", className)} 
    />
  );
}
