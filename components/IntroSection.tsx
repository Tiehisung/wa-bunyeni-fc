import { ReactNode } from "react";

interface IProps {
  image: string;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function IntroSection({
  icon,
  image,
  title,
  subtitle,
  className = "",
  children,
}: IProps) {
  return (
    <div
      style={{ backgroundImage: `url(${image})` }}
      className={`w-full min-h-56 relative flex flex-col items-center justify-center overflow-hidden bg-gray-200 text-white bg-no-repeat bg-center bg-cover ${className}`}
    >
      <div className="h-16 w-16 p-3 bg-secondary/50 text-3xl flex items-center rounded-full border border-border/60 z-10">
        {icon}
      </div>
      <div className="flex flex-col items-center justify-center z-10 px-5">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">{title}</h1>
        <p className="text-lg md:text-xl lg:text-2xl">{subtitle}</p>

        <div>{children}</div>
      </div>
      <div
        className={`absolute inset-0 bg-linear-to-br from-Red via-Orange to-Red w-full h-full object-cover opacity-30 select-none z-4 `}
      />
    </div>
  );
}
