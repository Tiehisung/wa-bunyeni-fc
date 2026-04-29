"use client";

import { IPlayer } from "@/types/player.interface";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { useUpdatePlayerMutation } from "@/services/player.endpoints";
import { getErrorMessage } from "@/lib/error";

export default function ChangePlayerTeam({ player }: { player: IPlayer }) {
  const [selectedTeam, setSelectedTeam] = useState(player.training?.team);
  const [updatePlayer] = useUpdatePlayerMutation();

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const teamValue = value as IPlayer["training"]["team"];

    setSelectedTeam(teamValue);

    try {
      const result = await updatePlayer({
        _id: player._id,
        training: { team: teamValue },
      }).unwrap();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update team"));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <Input
          type="radio"
          value="A"
          checked={selectedTeam === "A"}
          onChange={handleOnChange}
          name={`team-${player._id}`}
          className="w-4 h-4"
        />
        <span className="text-sm">Team A</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <Input
          type="radio"
          value="B"
          checked={selectedTeam === "B"}
          onChange={handleOnChange}
          name={`team-${player._id}`}
          className="w-4 h-4"
        />
        <span className="text-sm">Team B</span>
      </label>
    </div>
  );
}
