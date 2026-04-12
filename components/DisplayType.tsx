"use client";
import { Check, Grid2X2, List } from "lucide-react";
import { Button } from "./buttons/Button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks/store";
import { setSettings } from "@/store/slices/settings.slice";

const DisplayType = () => {
  const { displayType } = useAppSelector((s) => s.settings);
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-2 items-center divide-x-2 rounded-full border border-primary w-28 overflow-hidden">
      <Button
        className={cn("flex items-center gap-0.5 rounded-none")}
        variant={displayType == "list" ? "default" : "ghost"}
        onClick={() => {
          dispatch(
            setSettings({
              field: "displayType",
              data: "list",
            }),
          );
        }}
        size={"sm"}
      >
        {displayType == "list" && <Check />}

        <List />
      </Button>

      <Button
        className={cn("flex items-center gap-0.5 rounded-none")}
        variant={displayType == "grid" ? "default" : "ghost"}
        onClick={() => {
          dispatch(
            setSettings({
              field: "displayType",
              data: "grid",
            }),
          );
        }}
        size={"sm"}
      >
        {displayType !== "list" && <Check />}
        <Grid2X2 />
      </Button>
    </div>
  );
};

export default DisplayType;
