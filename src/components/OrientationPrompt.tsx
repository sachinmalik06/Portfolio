import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OrientationPrompt = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if device is mobile - improved detection
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      const isSmallScreen = window.innerWidth <= 768;
      const mobile = !!(mobileUA || (isTouchDevice && isSmallScreen));
      
      setIsMobile(mobile);

      // Check orientation
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);

      setIsReady(true);

      // Hide if landscape
      if (!portrait) {
        setHasShown(true);
      }
    };

    // Initial check after a brief delay
    setTimeout(() => {
      checkOrientation();
    }, 150);

    // Also check after a delay to catch any timing issues
    const timeoutId = setTimeout(() => {
      checkOrientation();
    }, 400);

    // Listen for orientation changes
    window.addEventListener("orientationchange", checkOrientation);
    window.addEventListener("resize", checkOrientation);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("orientationchange", checkOrientation);
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  const handleDismiss = () => {
    setHasShown(true);
  };

  // Only show on mobile devices in portrait mode and if not already shown and ready
  const shouldShow = isReady && isMobile && isPortrait && !hasShown;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center pointer-events-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-8 px-8 text-center max-w-sm"
          >
            {/* Rotate Phone PNG Image */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-full max-w-xs flex items-center justify-center"
            >
              <img
                src="/rotate-icon.png"
                alt="Rotate your phone to landscape"
                className="w-full h-auto object-contain max-w-[280px]"
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-white space-y-3"
            >
              <p className="text-gray-200 text-xl leading-relaxed font-medium">
                For the best experience, rotate the phone
              </p>
            </motion.div>

            {/* Dismiss button */}
            <motion.button
              onClick={handleDismiss}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-300 text-sm font-medium mt-2"
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Continue Anyway
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrientationPrompt;
