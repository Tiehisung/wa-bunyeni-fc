 

import React from "react";
import { motion, useInView } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  once?: boolean;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = "fit-content",
  once = true,
  className,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: once });

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};
