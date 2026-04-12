'use client'

import { useEffect, useState } from "react";
import { IQueryResponse } from "@/types";
import { ICaptain, IPlayer, IPlayerMini } from "@/types/player.interface";
import RadioButtons from "@/components/input/Radio";
import useGetParam from "@/hooks/params";
import { Verified } from "lucide-react";
import { SearchCaptains } from "./Search";
import { DIALOG } from "@/components/Dialog";
import { OverlayLoader } from "@/components/loaders/OverlayLoader";
import { fireEscape } from "@/hooks/Esc";
import { formatDate } from "@/lib/timeAndDate";
import { Badge } from "@/components/ui/badge";
import {
  useAssignCaptainMutation,
  useGetCaptainsQuery,
} from "@/services/captain.endpoints";
import { smartToast } from "@/utils/toast";

export type ICaptainProps = {
  isActive?: boolean;
  _id: string;
  player: Partial<IPlayerMini>;
  role: "captain" | "vice";
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export default function CaptaincyAdm({ players }: { players: IPlayer[] }) {
  const { data: captainsData } = useGetCaptainsQuery("isActive=true");

  const [filtered, setFiltered] = useState<ICaptainProps[]>(
    captainsData?.data as ICaptainProps[],
  );

  const captainType = useGetParam("captains") as
    | "current"
    | "passed"
    | undefined;

  const searchKey = useGetParam("search");

  function searcher(caps: ICaptainProps[]) {
    if (searchKey)
      return caps?.filter((c) =>
        c.player?.name?.toLowerCase()?.includes(searchKey.toLowerCase()),
      );
    return caps;
  }
  useEffect(() => {
    if (captainType == "current") {
      setFiltered(
        searcher((captainsData?.data ?? []).filter((c) => c.isActive)),
      );
    } else if (captainType == "passed") {
      setFiltered(
        searcher((captainsData?.data ?? []).filter((c) => !c.isActive)),
      );
    } else {
      const sorted = [
        ...(captainsData?.data ?? []).filter((c) => c.isActive),
        ...(captainsData?.data ?? []).filter((c) => !c.isActive),
      ];
      setFiltered(searcher(sorted));
    }
  }, [captainsData, captainType]);

  return (
    <div className="flex flex-col justify-center items-center bg-card pb-10">
      {/*  Captains */}

      <section>
        <header className="flex justify-center items-center gap-6 flex-col p-4 ">
          <h1 className="text-2xl md:text-4xl font-bold my-5"> Captains</h1>
          <SearchCaptains />
        </header>

        <ul className="flex items-start justify-start flex-wrap gap-10 my-10 p-4">
          {filtered?.filter(Boolean)?.map((captain, index) => (
            <li key={index}>
              <div>
                <img
                  src={captain?.player?.avatar as string}
                  width={300}
                  height={300}
                  alt="desc image"
                  className="h-36 w-36 rounded-xl shadow-md object-cover aspect-square"
                />
                <p className="_label text-[grayText] first-letter:uppercase flex items-center gap-3 mt-1">
                  {captain.isActive && (
                    <Verified className="text-Green" size={24} />
                  )}

                  <Badge
                    className="capitalize text-xs "
                    variant={captain.isActive ? "secondary" : "destructive"}
                  >
                    {captain?.role}
                  </Badge>
                </p>
                <p className="uppercase">{captain?.player?.name}</p>
                <div className="grid text-sm font-light gap-1">
                  {captain?.isActive ? (
                    <span>
                      Since:
                      {formatDate(captain?.startDate, "March 2, 2025")}
                    </span>
                  ) : (
                    <>
                      <span>
                        From:
                        {formatDate(captain?.startDate, "March 2, 2025")}
                      </span>
                      <span>
                        To:
                        {formatDate(captain?.startDate, "March 2, 2025")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Update Captaincy */}

      <section>
        <UpdateCaptaincy captains={captainsData?.data} players={players} />
      </section>
    </div>
  );
}

export const UpdateCaptaincy = ({
  players,
  captains,
}: {
  players?: IPlayer[];
  captains?: ICaptainProps[];
}) => {
  const [isBusy, setIsBusy] = useState(false);

  return (
    <DIALOG title trigger={"Update Captaincy"} variant="outline">
      <OverlayLoader isLoading={isBusy} className="backdrop:blur-none" />
      <table
        className={` bg-card w-full ${
          isBusy &&
          "ring-1 ring-red-400 pointer-events-none opacity-95 backdrop-blur-sm"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <tbody>
          <tr className=" text-left ">
            <th className="p-3 text-muted-foreground">#</th>
            <th className="p-3 text-muted-foreground">Player</th>
            <th className="p-3 text-muted-foreground">Captain</th>
          </tr>
          {players?.map((player, index) => (
            <PlayerForCaptainRow
              key={index}
              player={player}
              setIsBusy={setIsBusy}
              defaultRole={
                captains?.find(
                  (cap) => cap?.player?._id == player?._id && cap?.isActive,
                )?.role
              }
            />
          ))}
        </tbody>
      </table>
    </DIALOG>
  );
};

const PlayerForCaptainRow = ({
  player,
  defaultRole,
  setIsBusy,
}: {
  player: IPlayer;
  defaultRole?: ICaptainProps["role"];
  setIsBusy: (arg: boolean) => void;
}) => {
  const [assignCaptain, { isLoading }] = useAssignCaptainMutation();

  const [newRole, setNewRole] = useState<string>("");

  const handleChangeCaptain = async () => {
    try {
      if (defaultRole == newRole || !newRole) return; //Prevent duplication

      setIsBusy(true);

      const result: IQueryResponse = await assignCaptain({
        player: {
          _id: player?._id,
          name: `${player?.firstName} ${player?.lastName}`,
          number: player?.number,
          avatar: player?.avatar,
        },
        role: newRole,
      } as ICaptain).unwrap();
      smartToast(result);
      if (result.success) fireEscape();
    } catch (error) {
      smartToast({ error });
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    handleChangeCaptain();
  }, [newRole, defaultRole]);
  return (
    <tr className={`border ${isLoading && "pointer-events-none"}`}>
      <td className="p-2 font-black">{player.number}</td>
      <td className="p-2 uppercase">{`${player.firstName} ${player.lastName}`}</td>
      <td className="p-2">
        <RadioButtons
          values={["captain", "vice"]}
          setSelectedValue={setNewRole}
          defaultValue={defaultRole ?? ""}
          wrapperStyles="flex items-center gap-3"
        />
      </td>
    </tr>
  );
};
