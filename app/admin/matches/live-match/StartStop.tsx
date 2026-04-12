"use client";

import { IPlayer } from "@/types/player.interface";
import { Button } from "@/components/buttons/Button";
import { DIALOG } from "@/components/Dialog";
import { fireEscape } from "@/hooks/Esc";
import { apiConfig } from "@/lib/configs";
 
import { useState } from "react";
import { BiStop } from "react-icons/bi";
import { FcStart } from "react-icons/fc";
import { toast } from "sonner";
import { EMatchStatus, IMatch } from "@/types/match.interface";
import { getErrorMessage } from "@/lib/error";

interface IProps {
  match?: IMatch;
  players?: IPlayer[];
}
export function StartStopMatch({ match, players }: IProps) {
 

  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const handleStart = async () => {
    try {
      setIsStarting(true);

      const response = await fetch(`${apiConfig.matches}/live`, {
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          _id: match?._id,
          playerIds: players?.map((p) => p._id),
        }),
        method: "POST",
      });

      const results = await response.json();
      toast.success(results.message);
      fireEscape();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsStarting(false);
     
    }
  };

  const handleStop = async () => {
    try {
      setIsStopping(true);

      const response = await fetch(`${apiConfig.matches}`, {
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          _id: match?._id,
          status: EMatchStatus.FT,
        }),
        method: "PUT",
      });

      const results = await response.json();
      toast.success(results.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsStopping(false);
 
    }
  };

  return (
    <div>
      <div className="flex items-center gap-10">
        {match?.status == "UPCOMING" ? (
          <DIALOG
            title="Start Match"
            trigger="START MATCH"
            id="start-match"
            description="Are you sure you want to start this match?"
            variant="destructive"
          >
            <Button
              onClick={handleStart}
              className="justify-center _primaryBtn w-full"
              waiting={isStarting}
              primaryText="START MATCH"
              waitingText="STARTING..."
            >
              <FcStart className="mr-2 h-4 w-4" />
            </Button>
          </DIALOG>
        ) : (
          <DIALOG
            title="End Match"
            trigger="END MATCH"
            id="stop-match"
            description="Are you sure you want to stop this match?"
            variant="destructive"
          >
            <Button
              onClick={handleStop}
              className="justify-center _deleteBtn w-full"
              waiting={isStopping}
              primaryText="STOP MATCH"
              waitingText="STOPPING..."
            >
              <BiStop className="mr-2 h-4 w-4" />
            </Button>
          </DIALOG>
        )}
      </div>
    </div>
  );
}
