 
import { useState } from "react";
 
import { Button } from "@/components/ui/button";
import { IPlayer } from "@/types/player.interface";
import { IMVP } from "@/types/mvp.interface";

export function MatchMvpPanel({
  matchId,
  players,
  mvps,
}: {
  matchId: string;
  players: IPlayer[];
  mvps: IMVP[];
}) {
  const [loading, setLoading] = useState(false);

  async function setMvp(player: IPlayer) {
    setLoading(true);

    await fetch(`/api/matches/${matchId}/mvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player._id }),
    });

    location.reload();
  }

  async function removeMvp(mvpId: string) {
    await fetch(`/api/mvp/${mvpId}`, { method: "DELETE" });
    location.reload();
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* MVP LIST */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-3">🏆 Match MVPs</h3>

        {mvps.length === 0 && <p className="text-gray-500">No MVP selected</p>}

        {mvps.map((mvp) => (
          <div key={mvp._id} className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src={mvp.player.avatar}
                width={40}
                height={40}
                className="rounded-full"
                alt=""
              />
              <div>
                <p className="font-medium">{mvp.player.name}</p>
                <p className="text-xs text-gray-500">#{mvp.player.number}</p>
              </div>
            </div>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeMvp(mvp._id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      {/* PLAYER SELECTOR */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-3">Select Player</h3>

        <div className="space-y-2 max-h-125 overflow-y-auto">
          {players.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={p.avatar}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt=""
                />
                <div>
                  <p className="font-medium">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{p.position}</p>
                </div>
              </div>

              <Button size="sm" disabled={loading} onClick={() => setMvp(p)}>
                Make MVP
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
