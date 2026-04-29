 

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface MotionWrapperProps {
  children: React.ReactNode;
  index?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  hoverEffect?: boolean;
  className?: string;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  duration = 0.5,
  direction = "up",
  hoverEffect = true,
  className,
  index,
}) => {
  const delay = index ? (index % 3) * 0.05 : 0.05;
  const getDirectionOffset = () => {
    switch (direction) {
      case "up":
        return { y: 20 };
      case "down":
        return { y: -20 };
      case "left":
        return { x: 20 };
      case "right":
        return { x: -20 };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial={{ opacity: 0, ...getDirectionOffset() }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, ...getDirectionOffset() }}
        transition={{
          delay,
          duration,
          ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for smooth feel
        }}
        whileHover={
          hoverEffect
            ? {
                scale: 1.02,
                y: -4,
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)",
                transition: { type: "spring", stiffness: 250, damping: 15 },
              }
            : {}
        }
        whileTap={
          hoverEffect
            ? {
                scale: 0.98,
                y: 1,
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }
            : {}
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

type MotionPreset = "float" | "pop" | "fade" | "slide" | "bounce";

interface FancyMotionProps extends MotionWrapperProps {
  preset?: MotionPreset;
}

export const FancyMotion: React.FC<FancyMotionProps> = ({
  preset = "float",
  ...props
}) => {
  const variants = {
    float: { whileHover: { y: -6, scale: 1.02 } },
    pop: { whileHover: { scale: 1.05 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    slide: { initial: { x: 20 }, animate: { x: 0 } },
    bounce: { whileTap: { scale: 0.95, y: 3 } },
  };

  return <MotionWrapper {...variants[preset]} {...props} />;
};
