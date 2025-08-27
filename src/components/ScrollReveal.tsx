'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

type ScrollRevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string; // Allow passing custom classes
};

export default function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  return (
    // We removed the extra div and applied the ref and className directly here
    <motion.div
      ref={ref}
      className={className} // Pass through any classes like h-full
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.5, delay: delay }}
    >
      {children}
    </motion.div>
  );
}