 

import { motion } from "framer-motion";

interface LeftMotionProps {
  children: React.ReactNode;
  x?: number;
  duration?: number;
  once?: boolean;
  height?: string | number;
}

export default function LeftMotion({ children, x, duration, once, height }: LeftMotionProps) {
  return (
    <motion.div
      animate={{ x: x || -200 }}
      whileInView={{ x: 0 }}
      transition={{ duration: duration || 1 }}
      viewport={{ once: once }}
      style={{ height: height }}
    >
      {children}
    </motion.div>
  );
}
