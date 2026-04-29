 
import { IPlayer } from "@/types/player.interface";

export const PlayerCardA = ({
  player,
}: {
  player?: IPlayer;
  link?: string;
}) => {
  return (
    <div className="group after:h-1 after:w-full after:bg-primary after:mt-2 after:block">
      <img
        alt={player?.lastName ?? "img"}
        src={player?.avatar as string}
        width={400}
        height={400}
        className="aspect-square w-full rounded-lg bg-secondary object-cover group-hover:opacity-85 xl:aspect-7/8"
      />
      <h3 className="mt-4 text-sm text-muted-foreground">
        {`${player?.firstName} ${player?.lastName}`}
      </h3>
      <p className="mt-1 text-lg font-medium text-muted-foreground">
        {player?.number}
      </p>
    </div>
  );
};
