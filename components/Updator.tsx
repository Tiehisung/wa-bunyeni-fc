 

import DiveUpwards from "@/components/Animate";
import { useState, useEffect } from "react";

const updates = [
  "Goal by KFC",
  "Yellow card to Opponent",
  "Red card to KFC",
  "Substitution KFC",
];

interface IProps {
  data?: string[];
  random?: boolean;
  every?: number;
  className?:string
}
export const Updator = ({ data = updates, random, every = 5000,className }: IProps) => {
  const [update, setUpdate] = useState(data?.[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const valueIndex = random ? Math.floor(Math.random() * data.length) : 0;
      setUpdate(data[valueIndex]);
    }, every);
    return () => clearInterval(interval);
  }, [data]);
  return (
    <DiveUpwards
      layoutId={update}
      dependency={update}
      y={5}
      className={`line-clamp-1 max-w-40 ${className}`}
    >
      {update}
    </DiveUpwards>
  );
};
