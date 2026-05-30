"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";

import { EGoalType, IGoal, IMatch, ITeam } from "@/types/match.interface";
import { PrimaryCollapsible } from "@/components/Collapsible";

import {
  useCreateGoalMutation,
  useDeleteGoalMutation,
} from "@/services/goals.endpoints";
import { smartToast } from "@/utils/toast";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import SELECT from "@/components/select/Select";
import RadioButtons from "@/components/input/Radio";
import { cn } from "@/lib/utils";
import { ENV } from "@/lib/env";
import { ISelectOptionLV } from "@/types";

interface ScoreEventsTabProps {
  opponent?: ITeam;
  match: IMatch;
}

export function ScoreEventsTab({ match }: ScoreEventsTabProps) {
  const { data: playersData } = useGetPlayersQuery({});

  const players = playersData?.data || [];
  const [addGoal, { isLoading }] = useCreateGoalMutation();
  const [form, setForm] = useState({
    scorer: null as any,
    assist: null as any,
    minute: "",
    description: "",
    modeOfScore: EGoalType.OPEN_PLAY,
    teamId: ENV.TEAM_ID,
  });

  const teams = [
    { label: ENV.TEAM_NAME, value: ENV.TEAM_ID },
    { label: match.opponent.name || "Opponent", value: match.opponent._id },
  ];

  const handleAddGoal = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!form.minute)
        return smartToast({
          message: "Please specify the time in minutes, and description",
        });

      let newGoal: any = {
        ...form,
        minute: Number.parseInt(form.minute),
        description: `⚽ ${form.description}`,
        modeOfScore: "Open Play Goal",
        match: match?._id,
        teamId: form.teamId,
        scorer: form.scorer
          ? {
              name: `${form.scorer.firstName} ${form.scorer.lastName}`,
              _id: form.scorer._id,
              avatar: form.scorer.avatar,
              number: form.scorer.number,
            }
          : null,
        assist: form.assist
          ? {
              name: `${form.assist.firstName} ${form.assist.lastName}`,
              _id: form.assist._id,
              avatar: form.assist.avatar,
              number: form.assist.number,
            }
          : null,
      };

      console.log("Adding Goal:", newGoal);
      const results = await addGoal(newGoal).unwrap();

      if (results.success)
        setForm({
          scorer: null as any,
          assist: null as any,
          minute: "",
          description: "",
          modeOfScore: EGoalType.OPEN_PLAY,
          teamId: "",
        });
      smartToast(results);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div className="space-y-8">
      <Card
        className={`p-6 rounded-none ${isLoading ? "pointer-events-none" : ""}`}
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <h2 className="mb-6 text-2xl font-bold flex items-center gap-6 justify-between border-b">
            Add Goal
          </h2>
          <SELECT
            label="Team"
            options={
              (match.isHome ? teams : teams.reverse()) as ISelectOptionLV[]
            }
            placeholder="Select Team"
            className="grid mb-3"
            onChange={(id) => setForm((prev) => ({ ...prev, teamId: id }))}
            value={form.teamId}
            required
          />

          <Input
            type="number"
            others={{ min: "0", max: "120" }}
            placeholder="e.g., 45"
            value={form.minute}
            required
            onChange={(e) =>
              setForm((prev) => ({ ...prev, minute: e.target.value }))
            }
            name={"goalMinute"}
            label="Minute"
          />

          <Input
            placeholder="e.g., VAR Review, Penalty Decision, etc."
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            name={"goalDescription"}
            label="Comment"
          />

          {form.teamId !== ENV.TEAM_ID && (
            <Input
              placeholder="Scorer Name (Optional)"
              value={form.scorer?.name || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  scorer: {
                    firstName: e.target.value,
                    lastName: "",
                  } as any,
                }))
              }
              name={"scorer"}
              label="Player Name (Optional)"
            />
          )}

          {form.teamId === ENV.TEAM_ID && (
            <div className="grid grid-cols-1 gap-4 ">
              <SELECT
                label="Scorer"
                options={players?.map((p) => ({
                  label: `${
                    p.lastName
                  } ${p?.firstName}(${p?.number ?? p?.number})`,
                  value: p._id,
                }))}
                placeholder="Scored by"
                className="grid"
                onChange={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    scorer: players.find((p) => p._id === id),
                  }))
                }
                value={form.scorer?._id}
              />

              <SELECT
                label="Assist (Optional)"
                options={players?.map((p) => ({
                  label: `${
                    p.lastName
                  } ${p?.firstName}(${p?.number ?? p?.number})`,
                  value: p._id,
                }))}
                placeholder="Assisted by"
                className="grid"
                onChange={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    assist: players.find((p) => p._id === id),
                  }))
                }
                value={form.assist?._id}
                disabled={!form.scorer}
              />
            </div>
          )}

          <PrimaryCollapsible
            header={{
              label: `Goal Type(${form.modeOfScore})`,
              className: "_label border",
            }}
          >
            <RadioButtons
              defaultValue={EGoalType.OPEN_PLAY}
              setSelectedValue={(value) =>
                setForm((prev) => ({
                  ...prev,
                  modeOfScore: value as EGoalType,
                }))
              }
              values={Object.values(EGoalType)}
              label=""
              wrapperStyles="flex gap-3 items-center flex-wrap"
            />
          </PrimaryCollapsible>

          <div className="gap-6 flex items-center mt-8">
            <Button
              className=" grow"
              waiting={isLoading}
              primaryText=" Add Goal"
              waitingText="Adding Goal"
              type="submit"
            >
              <Plus className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Goals */}
        <PrimaryCollapsible
          header={{
            label: "All Goals",
            className: "_label",
          }}
          defaultOpen
        >
          <div
            className={
              "flex items-center gap-5 flex-wrap " +
              (isLoading ? "opacity-70 pointer-events-none cursor-wait" : "")
            }
          >
            {match?.goals?.map((goal) => (
              <Goal goal={goal} key={goal._id} />
            ))}
          </div>
        </PrimaryCollapsible>
      </Card>
    </div>
  );
}

function Goal({ goal }: { goal: IGoal }) {
  const [deleteGoal, { isLoading }] = useDeleteGoalMutation();

  //Increment Opponent goals
  const handleRemoveGoal = async (goal: IGoal) => {
    try {
      const result = await deleteGoal(goal?._id as string).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const isTeamGoal = goal.teamId === ENV.TEAM_ID;
  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-muted px-4 py-2 rounded-lg",
        isTeamGoal ? "" : "text-destructive",
      )}
      key={goal._id}
    >
      {`${goal.minute}' ${
        isTeamGoal
          ? goal.scorer?.name || `${ENV.TEAM_ALIAS} Player`
          : goal.scorer?.name || "Opponent"
      }`}
      <Button
        onClick={() => handleRemoveGoal(goal)}
        size="sm"
        variant={"ghost"}
        waiting={isLoading}
        waitingText={"Deleting..."}
      >
        <X />
      </Button>
    </div>
  );
}
