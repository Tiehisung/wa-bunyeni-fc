'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const DiveUpwards = ({
  children,
  className = 'relative',
  y = 50,
  once = true,
  duration = '0.5',
  layoutId = 'id',
  dependency,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  once?: boolean;
  duration?: '0.05' | '0.1' | '0.2' | '0.5' | '1.0' | '1.5';
  layoutId: string;
  dependency?: number | string | boolean;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2, // Adjust threshold as needed
    triggerOnce: once,
  });
  // Delay rendering of tab to apply animation
  const [delayOn, setDelayOn] = useState(false);
  useEffect(() => {
    setDelayOn(true);
    const timeout = setTimeout(() => {
      setDelayOn(false);
    }, 1);
    return () => clearTimeout(timeout);
  }, [dependency]);

  if (delayOn) return null;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: y }} // Initial values for animation
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : y }} // Animate on view
      transition={{ duration: parseFloat(duration) }} // Animation duration
      onClick={(e) => e.stopPropagation()}
      layoutId={layoutId}
    >
      <div className={className}>{children}</div>
    </motion.div>
  );
};

export default DiveUpwards;

export const SlideOnView = ({
  children,
  className = 'relative',
  x = 30,
  once = true,
  duration = '0.5',
  dependency,
  layoutId,
}: {
  children: ReactNode;
  className?: string;
  x?: number;
  once?: boolean;
  duration?: '0.1' | '0.2' | '0.5' | '1.0' | '1.5';
  dependency?: number | string | boolean;
  layoutId: string;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: once,
  });

  // Delay rendering of tab to apply animation
  const [delayOn, setDelayOn] = useState(false);
  useEffect(() => {
    setDelayOn(true);
    const timeout = setTimeout(() => {
      setDelayOn(false);
    }, 1);
    return () => clearTimeout(timeout);
  }, [dependency]);

  if (delayOn) return null;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: x }} // Initial values for animation
      animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : x }} // Animate on view
      transition={{
        duration: parseFloat(duration),
        type: 'spring',
      }} // Animation duration
      onClick={(e) => e.stopPropagation()}
      className={className}
      layoutId={layoutId}
    >
      {children}
    </motion.div>
  );
};

export const AnimateOnPresence = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 200);
  }, [children]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="animated"
          initial={{ opacity: 0.5, x: -2 }}
          animate={{ opacity: 1, x: 0 }}
          // exit={{ opacity: 0, x: -2 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
