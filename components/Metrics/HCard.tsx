'use client'

import { TColor } from "@/types/color";
import { Card, CardContent } from "../ui/card";
import Loader from "../loaders/Loader";

interface IProps {
  title?: string;
  icon?: React.ReactNode;
  value?: string | number;
  color?: TColor;
  isLoading?: boolean;
  onClick?: () => void;
}

export function HoriMetricCard({
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
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${cl}`}>{icon}</div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-xl font-bold">
                {isLoading ? <Loader size="sm" /> : value}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
