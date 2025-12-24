import { useScroll, useTransform, motion, useSpring } from "framer-motion";
// ...
  const scrollYProgressSpring = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

{/* Timeline Section */}
<div ref={timelineRef} className="relative z-10 bg-background opacity-0 will-change-[transform,opacity]">
  <Timeline data={timelineData} />
</div>