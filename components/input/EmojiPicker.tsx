 

import { useState } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";

export enum EEmoji {
  GOAL = "⚽",
  ASSIST = "🎯",
  YELLOW_CARD = "🟨",
  RED_CARD = "🟥",
  INJURY = "🤕",
  SAVE = "🧤",
  TROPHY = "🏆",
  SUBSTITUTION = "🔁",
  TIME = "⏱️",
  SHOT = "🥅",
  CAPTAIN = "🫡",
}

export const FOOTBALL_EMOJIS = [
  { label: "Goal", value: EEmoji.GOAL },
  { label: "Assist", value: EEmoji.ASSIST },
  { label: "Y Card", value: EEmoji.YELLOW_CARD },
  { label: "R Card", value: EEmoji.RED_CARD },
  { label: "Injury", value: EEmoji.INJURY },
  { label: "Save", value: EEmoji.SAVE },
  { label: "Trophy", value: EEmoji.TROPHY },
  { label: "Subst.", value: EEmoji.SUBSTITUTION },
  { label: "Time", value: EEmoji.TIME },
  { label: "Shot", value: EEmoji.SHOT },
  { label: "Captain", value: EEmoji.CAPTAIN },
]  

interface EmojiPickerProps {
  emojis?: { label: string; value: string }[];
  onSelect?: (emoji: { label: string; value: string }) => void;
  defaultSelected?: string;
  label?: string;
  className?:string
}

export function EmojiPicker({
  emojis = FOOTBALL_EMOJIS,
  onSelect,
  defaultSelected,
  label,className
}: EmojiPickerProps) {
  const [selected, setSelected] = useState(defaultSelected || "");

  const handleSelect = (emoji: { label: string; value: string }) => {
    setSelected(emoji.label);
    onSelect?.(emoji);
  };

  return (
    <div className="space-y-3">
      {label && (
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </h3>
      )}
      <div className={cn("flex items-center gap-1 p-2.5",className)}>
        {emojis.map((emoji) => (
          <button
            type="button"
            key={emoji.label}
            onClick={() => handleSelect(emoji)}
            className={clsx(
              "flex flex-col items-center justify-center p-2 rounded-xl border transition-all hover:scale-105",
              selected === emoji.label
                ? "border-primary bg-primary/10 scale-110"
                : "border-gray-300 hover:border-primary/50"
            )}
            title={emoji.label}
          >
            <span className="text-2xl">{emoji.value}</span>
            <span className="text-[10px] font-medium mt-1 text-gray-600">
              {emoji.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
