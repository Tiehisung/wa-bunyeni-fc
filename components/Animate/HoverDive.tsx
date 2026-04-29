 

import { motion } from "framer-motion";
import   { FC, ReactNode } from "react";

const HoverDive: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const variants = {
    mouseEnter: {
      y: -10,
      // boxShadow: "1 0 11px 0 black",
    },
    mouseLeave: {
      y: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      transition={{ ease: "linear", duration: 0.15 }}
      whileHover={"mouseEnter"}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default HoverDive;

