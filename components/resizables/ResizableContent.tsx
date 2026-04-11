 ;

import { useEffect, useRef, useState, type ReactNode } from "react";

 
import { useGetViewportWidth } from "@/hooks/windowXY";
import { POPOVER } from "../ui/popover";
import { useOverflow } from "../../hooks/overflow";
import { toggleClick } from "@/lib/dom";
import { cn } from "@/lib/utils";
 

export const ResizableContent = ({
  children,
  className = "grow  max-w-[85vw]",
}: {
  children: ReactNode[];
  className?: string;
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const screenWidth = useGetViewportWidth();
  const [count, setCount] = useState(
    screenWidth <= 640
      ? 3
      : screenWidth <= 768
        ? 4
        : screenWidth <= 1024
          ? 6
          : 8,
  );

  const isOverflowing = useOverflow(outerRef, "horizontal");

  useEffect(() => {
    const outerWidth = outerRef.current?.offsetWidth;
    const innerWidth = innerRef.current?.offsetWidth;

    const compute = () => {
      if (!outerWidth || !innerWidth) return;

      if (outerWidth > innerWidth + 160) {
        const n = children.length > count ? count + 1 : count;

        setCount(n);
      } else if (innerWidth + 60 >= outerWidth) {
        const n = count > 1 ? count - 1 : count;
        setCount(n);
      }
    };
    compute();

    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("resize", compute);
    };
  }, [isOverflowing, screenWidth]);

  return (
    <div ref={outerRef} className={cn(`flex w-full  `, className)}>
      <div ref={innerRef} className="flex items-center gap-2 w-fit">
        {children.slice(0, count)}

        <HiddenDropdownContent hiddenContent={children.slice(count)} />
      </div>
    </div>
  );
};

const HiddenDropdownContent = ({
  hiddenContent,
}: {
  hiddenContent: ReactNode[];
}) => {
  return (
    <div>
      {hiddenContent.length > 0 && (
        <POPOVER  variant={'secondary'}>
          {hiddenContent.map((Element, i) => (
            <div
              key={i}
              className={"grid *:w-full mb-1.5"} // _growChild same as *:w-full
              onClick={() => toggleClick("hidden-drop")}
            >
              {Element}
            </div>
          ))}
        </POPOVER>
      )}
    </div>
  );
};
