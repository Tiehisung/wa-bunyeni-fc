import { getInitials } from "@/lib";
import { cn } from "@/lib/utils";
import { IPlayerMini } from "@/types/player.interface";
import Image from "next/image";

const SquadPlayer = ({
  player,
  className,
}: {
  player: IPlayerMini;
  className?: string;
}) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-border">
      <div
        className={cn("relative h-64 overflow-hidden bg-gray-100", className)}
      >
        <Image
          src={player?.avatar as string}
          alt={player?.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-3 left-3 bg-primary uppercase font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-md">
          {player?.number || getInitials(player?.position?.split(" "))}
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-xl ">{player?.name}</h3>
        <p className="text-primary text-sm mb-1 font-semibold capitalize">
          {player?.position}
        </p>
      </div>
    </div>
  );
};

export default SquadPlayer;
