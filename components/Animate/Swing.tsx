import { motion } from "framer-motion";
import { ReactNode } from "react";
interface ISwingerProps {
  children: ReactNode;
  repeat?: number;
  direction?: "x" | "y";
  amplitude?: "2" | "5" | "10" | "15" | "20";
  className?:string
}
export function Swinger({
  children,
  repeat = Infinity,
  direction = "y",
  amplitude = "10",className
}: ISwingerProps) {
  const animate =
    direction == "x"
      ? { x: [0, Number(amplitude), 0] }
      : { y: [0, Number(amplitude), 0] };
  return (
    <motion.div
      animate={animate}
      transition={{ duration: 2, repeat: repeat }}
      className={className}
    >
      <div>{children}</div>
    </motion.div>
  );
}
