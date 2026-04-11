"use client";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { shortText } from "@/lib";
import { EMatchStatus, IMatch } from "@/types/match.interface";

import { DIALOG } from "@/components/Dialog";
import SquadCard from "../../squad/SquadCard";
import SquadForm from "../../squad/SquadForm";
import {
  useUpdateMatchMutation,
  useDeleteMatchMutation,
} from "@/services/match.endpoints";
import { smartToast } from "@/utils/toast";
import { fireEscape } from "@/hooks/Esc";
import { StackModal } from "@/components/modals/StackModal";
import { MatchForm } from "../FixtureForm";

interface Props {
  match?: IMatch;
}

const MatchActions = ({ match }: Props) => {
  const status = match?.status;
  const [updateMatch] = useUpdateMatchMutation();
  const [deleteMatch] = useDeleteMatchMutation();

  const handleStatusUpdate = async (newStatus: "LIVE" | "FT") => {
    try {
      const result = await updateMatch({
        _id: match?._id,
        status: newStatus as EMatchStatus,
      }).unwrap();

      smartToast(result);
      fireEscape();
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteMatch(match?._id as string).unwrap();
      if (result.success) window.location.href = "/admin/matches";
      smartToast(result);
      fireEscape();
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div>
      <fieldset className="border p-3">
        <legend>Match Actions</legend>
        <div className="flex items-center gap-5 flex-wrap mb-4">
          <StackModal
            trigger={"Edit"}
            id={`edit-m-${match?._id}`}
            variant={"ghost"}
          >
            <MatchForm fixture={match} />
          </StackModal>

          {match?.squad ? (
            <DIALOG
              trigger="Squad"
              title=""
              className="min-w-[80vw]"
              variant="outline"
            >
              <SquadCard match={match} />
            </DIALOG>
          ) : (
            <DIALOG
              trigger="Choose Squad"
              variant="ghost"
              size="sm"
              title={`SQUAD for ${match?.title}`}
              className="min-w-[80vw]"
            >
              <SquadForm defaultMatch={match} />
            </DIALOG>
          )}

          {status === "UPCOMING" && (
            <ConfirmDialog
              description={`Are you sure you want this match to go live? \n <i>${
                match?.title ?? ""
              }</i>`}
              onConfirm={() => handleStatusUpdate("LIVE")}
              trigger="Go Live"
              triggerStyles="text-sm p-1.5 px-2 justify-start"
              variant="destructive"
              title={`Start ${match?.title}`}
            />
          )}

          {status === "LIVE" && (
            <ConfirmDialog
              description={`Do you want to finish this match? \n <i>${
                match?.title ?? ""
              }</i>`}
              onConfirm={() => handleStatusUpdate("FT")}
              trigger="End Live"
              triggerStyles="text-sm p-1.5 px-2 justify-start"
              variant="destructive"
              title={`End | ${match?.title}`}
            />
          )}

          <ConfirmDialog
            trigger="Delete"
            onConfirm={handleDelete}
            variant="destructive"
            title={shortText(match?.title ?? "Match")}
            description={`Are you sure you want to delete "<b>${shortText(
              match?.title ?? "Match",
              40,
            )}</b>"?`}
          />
        </div>{" "}
      </fieldset>
    </div>
  );
};

export default MatchActions;
