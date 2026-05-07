"use client";

import { IPlayer } from "@/types/player.interface";
import { Button } from "@/components/buttons/Button";
import { Input, TextArea } from "@/components/input/Inputs";
import { FormEvent, useState } from "react"; // Add FormEvent import
import { TbRibbonHealth } from "react-icons/tb";
import { icons } from "@/assets/icons/icons";
import { DIALOG } from "@/components/Dialog";
import { TITLE } from "@/components/Element";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { getTimeAgo } from "@/lib/timeAndDate";
import { IAccordionProps, PrimaryAccordion } from "@/components/ui/accordion";
import { useUpdatePlayerMutation } from "@/services/player.endpoints";
import { smartToast } from "@/utils/toast";
import { fireEscape } from "@/hooks/Esc";

export default function UpdatePlayerIssuesAndFitness({
  player,
}: {
  player: IPlayer;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [updatePlayer, { isLoading }] = useUpdatePlayerMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Fixed type here
    e.preventDefault();
    try {
      const updatedIssues = [
        { title, description, date: new Date().toISOString() },
        ...player?.issues,
      ];

      const result = await updatePlayer({
        _id: player._id,
        issues: updatedIssues,
      }).unwrap();

      if (result.success) {
        setTitle("");
        setDescription("");
        fireEscape();
      }

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const accordionData: IAccordionProps["data"] = player?.issues?.map(
    (issue, i) => ({
      content: (
        <div className="ml-2 border-l pl-0.5">
          {issue?.description}{" "}
          {issue?.date && (
            <span className="text-muted-foreground text-xs ml-auto">
              {getTimeAgo(issue.date)}{" "}
            </span>
          )}
        </div>
      ),
      trigger: <p className="line-clamp-1 pl-1 max-w-full">{issue?.title}</p>,
      value: issue?.title + i,
    }),
  );

  return (
    <div id="fitness-update" className="pt-6">
      <header className="flex items-center justify-between gap-3">
        <TITLE icon={<TbRibbonHealth size={36} />} text="ISSUES UPDATES" />

        <DIALOG
          title="Add Issue"
          variant="outline"
          trigger={<icons.new size={32} />}
        >
          <form
            onSubmit={handleSubmit}
            className="grid gap-3 p-2  rounded-md  "
          >
            <Input
              name="title"
              label="Issue Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="w-full"
              required
            />
            <TextArea
              required
              name="description"
              label="Issue description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="max-h-32 min-h-16 w-full"
            />

            <Button
              type="submit"
              primaryText="Update"
              waiting={isLoading}
              waitingText="Updating, wait..."
              disabled={!title}
              className=" grow px-5 rounded shadow justify-center"
            />
          </form>
        </DIALOG>
      </header>

      <br />

      <PrimaryCollapsible header={{ label: "View Issues" }}>
        <PrimaryAccordion
          data={accordionData}
          className=" backdrop-blur-[1px] overflow-x-hidden mx-2"
        />
      </PrimaryCollapsible>
    </div>
  );
}
