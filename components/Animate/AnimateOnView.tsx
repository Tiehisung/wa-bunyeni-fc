 

import { motion } from "framer-motion";

import { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface IInviewProps {
  index?: number;
  children: ReactNode;
  className?: string;
  y?: number;
  x?: number;
  once?: boolean;
  delay?: number;
}

export const AnimateOnView = ({
  index = 0,
  children,
  className,
  y = 20,
  x,
  once = true,
  delay = 0.1,
}: IInviewProps) => {
  const { ref, inView } = useInView({ triggerOnce: once });
  const z = x ? { x } : { y };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...z }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
