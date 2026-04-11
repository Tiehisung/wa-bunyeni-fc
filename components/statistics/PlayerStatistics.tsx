import { IPlayer } from "@/types/player.interface";
import _players from "@/data/players";
 
import React from "react";

interface PlayersStatsProps {
  title: string;
  featuredPlayer: Partial<IPlayer> & {
    value: string;
  };
  otherPlayers: Array<Partial<IPlayer> & { value: number }>;
  theme?: { text: string; bg: string; border: string };
  tag?: "Goals" | "Dribbles" | "Assists";
}

export const PlayersStatsCard: React.FC<PlayersStatsProps> = ({
  title,
  featuredPlayer,
  otherPlayers,
  tag,
}) => {
  return (
    <div className="min-w-64 max-w-sm py-4">
      {/* Header */}
      <h3 className="text-lg font-bold mb-4 pl-6">{title}</h3>

      {/* Featured Player */}
      <main className="bg-white border border-gray-200 shadow-md rounded-lg  ">
        <section
          className={
            "relative  flex items-center bg-blue-100 rounded-lg rounded-b-none p-4 mb-6 "
          }
        >
          <div>
            <h4 className="text-xl font-bold">{featuredPlayer?.lastName}</h4>
            <p className="text-xl md:text-2xl font-semibold text-blue-600">
              {`${featuredPlayer?.value} ${tag}`}
            </p>
          </div>

          <img
            width={500}
            height={500}
            src={featuredPlayer?.avatar as string}
            alt={"featuredPlayer"}
            className=" absolute -top-10 right-6 w-24 h-24 rounded-full "
          />
        </section>

        {/* Other Players */}
        <section className="space-y-3 px-4">
          {otherPlayers?.map((player, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-200 pb-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  width={500}
                  height={500}
                  src={player?.avatar as string}
                  alt={"player"}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-medium line-clamp-1 whitespace-nowrap">
                  {player?.firstName + " " + player?.lastName}
                </span>
              </div>
              <span className="text-lg font-bold">{player?.value}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

const PlayerStatistics = async () => {
  const stats: PlayersStatsProps[] = [
    {
      title: "Goals",
      featuredPlayer: { ..._players[0], value: "7" },
      otherPlayers: _players.slice(2, 5).map((op, i) => ({ ...op, value: i })),
      tag: "Goals",
    },
    {
      title: "Assists",
      featuredPlayer: { ..._players[0], value: "4 " },
      otherPlayers: _players.slice(2, 5).map((op, i) => ({ ...op, value: i })),
      tag: "Assists",
    },
    {
      title: "Dribbles",
      featuredPlayer: { ..._players[0], value: "76" },
      otherPlayers: _players.slice(2, 5).map((op, i) => ({ ...op, value: i })),
      tag: "Dribbles",
    },
  ];
  return (
    <div>
      <h2 className="font-bold my-3 px-3">Player statistics</h2>{" "}
      <div className="flex gap-6 overflow-x-auto px-6">
        {stats.map((ps, i) => (
          <PlayersStatsCard key={i} {...ps} />
        ))}
      </div>
    </div>
  );
};
export default PlayerStatistics;
