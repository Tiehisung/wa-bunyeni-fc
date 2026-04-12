import { ReactNode } from "react";
import Loader from "../loaders/Loader";
import CountUp from "react-countup";
import { TColor } from "@/types/color";
import { cn } from "@/lib/utils";
import { LucideProps, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Glassmorphic } from "../Glasmorphic/BasicGlassmorphic";
import { Skeleton } from "../ui/skeleton";

interface IProps {
  title?: string;
  icon?: React.ReactNode;
  value?: string | number;
  color?: TColor;
  isLoading?: boolean;
  onClick?: () => void;
}

export function MetricCard({
  title,
  icon,
  value,
  color,
  isLoading,
  onClick,
}: IProps) {
  const txtCl = `text-${color}-500`;
  const cl = `${txtCl} bg-${color}-50`;
  return (
    <div className="bg-card rounded-xl shadow-card p-6" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="grow">
          <p className="text-sm text-muted-foreground grow">
            {isLoading ? (
              <div className="animate-pulse bg-muted h-4 w-full" />
            ) : (
              title
            )}
          </p>
          <p className={`text-2xl font-bold ${txtCl}`}>
            {isLoading ? <Loader size="sm" /> : value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${cl} `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

interface ICountupProps {
  icon: ReactNode;
  value: string | number;
  isCountUp?: boolean;
  description?: string;
  countupSuffix?: string;
  countupPrefix?: string;
  isLoading?: boolean;
  color?: TColor;
  className?: string;
  onClick?: () => void;
}
export function CountupMetricCard({
  icon,
  value,
  countupPrefix,
  countupSuffix,
  description,
  isCountUp,
  isLoading,
  color,
  className,
  onClick,
}: ICountupProps) {
  const txtCl = `text-${color}-500`;
  const _color = `${txtCl} bg-${color}-50`;
  return (
    <div
      className={cn(
        "relative text-center p-4 rounded-2xl bg-card backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors",
        className,
      )}
    >
      <div
        className={` p-3 w-fit h-fit rounded-lg flex items-center justify-center mx-auto ${_color} `}
      >
        {icon}
      </div>
      <div className={`text-3xl font-bold mb-1 ${txtCl}`}>
        {isLoading ? (
          <div className="animate-pulse bg-secondary h-4 w-full" />
        ) : (
          <div>
            {isCountUp ? (
              <CountUp
                end={Number(value ?? 0)}
                prefix={countupPrefix ?? ""}
                suffix={countupSuffix ?? ""}
              />
            ) : (
              value
            )}
          </div>
        )}
      </div>
      <div className="text-sm text-muted-foreground grow">
        {isLoading ? (
          <div className="animate-pulse bg-secondary h-4 w-full" />
        ) : (
          description
        )}
      </div>
      {typeof onClick !== "undefined" && (
        <Button
          onClick={onClick}
          className="absolute right-1 top-2 rounded-full"
          size="icon-sm"
          variant="ghost"
        >
          <MoreVertical />
        </Button>
      )}
    </div>
  );
}

interface IMetricCardB {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  value: string | number;
  description?: string;
  isLoading?: boolean;
  color?: TColor;
  onClick?: () => void;
}
export function MetricCardB({
  icon,
  value,
  description,
  isLoading,
  // color,

  onClick,
}: IMetricCardB) {
  // const txtCl = `text-${color}-500`;
  // const _color = `${txtCl} bg-${color}-50`;
 

  const _icon = { icon };
  return (
    <Glassmorphic
      onClick={onClick}
      className="border border-primary dark:border-primary shadow-none overflow-hidden relative py-4 "
    >
      <div
        className={` w-2 absolute left-0 top-3 bottom-3 bg-primary rounded-r-md`}
      />

      <div className="flex items-center justify-between p-2 pl-5">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            {isLoading ? <Skeleton /> : description}
          </p>
          <p className="text-3xl font-black text-foreground mt-1">
            {isLoading ? <Loader size="xs" /> : value}
          </p>
        </div>
        <_icon.icon className="text-muted-foreground/30" size={40} />
      </div>
    </Glassmorphic>
  );
}
