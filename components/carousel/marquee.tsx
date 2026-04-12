 

import  { ReactNode } from "react";

export default function MarqueeCarousel({
  children,
  speed = 30,
  title,
  className,
}: {
  children: ReactNode;
  speed?: number; // lower = faster scroll
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden py-10 rounded-2xl ${className}`}
    >
      {title && (
        <h2 className="text-center text-3xl font-semibold mb-8 text-foreground">
          {title}
        </h2>
      )}

      <div className="w-full overflow-hidden">
        <div
          className="flex items-center gap-14 _marquee"
          style={{ animationDuration: `${speed}s` }}
        >
          {[
            ...((children as ReactNode[]) ?? []),
            ...((children as ReactNode[]) ?? []),
          ].map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
