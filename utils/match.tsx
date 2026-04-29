import { Minus, TrendingDown, Trophy } from "lucide-react";

  export const getResultTextColor = (result: string) => {
    switch (result) {
      case "win":
        return "text-green-600 bg-green-100 dark:bg-green-950/30";
      case "draw":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/30";
      case "loss":
        return "text-red-600 bg-red-100 dark:bg-red-950/30";
      default:
        return "";
    }
  };

  export const getResultIcon = (result: string) => {
    switch (result) {
      case "win":
        return <Trophy className="w-4 h-4" />;
      case "draw":
        return <Minus className="w-4 h-4" />;
      case "loss":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };