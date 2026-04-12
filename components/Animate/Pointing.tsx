import { ReactNode } from "react";
import {
  LiaHandPointerSolid,
  LiaHandPointRightSolid,
} from "react-icons/lia";
import styles from "./pointing.module.css";

interface MovingProps {
  animationDuration?: number;
  className?: string;
  icon?: ReactNode;
  direction?: "up" | "down" | "right" | "left";
}

const PointingLeftRight: React.FC<MovingProps> = ({
  animationDuration = 1,
  className = "",
  icon,
  direction = "right",
}) => {
  const towards = direction == "left" ? "rotate-180" : "";
  return (
    <div
      className={`${styles.movingLR} ${className}`}
      style={
        {
          "--animation-duration": `${animationDuration}s`,
        } as React.CSSProperties
      }
    >
      {icon ?? <LiaHandPointRightSolid className={towards} />}
    </div>
  );
};
export default PointingLeftRight;

export const PointingTopDown: React.FC<MovingProps> = ({
  animationDuration = 1,
  className = "",
  icon,
  direction = "up",
}) => {
  const towards = direction == "up" ? "" : "rotate-180";
  return (
    <div
      className={`${styles.movingUD} ${className}`}
      style={
        {
          "--animation-duration": `${animationDuration}s`,
        } as React.CSSProperties
      }
    >
      {icon ?? <LiaHandPointerSolid className={towards} />}
    </div>
  );
};
