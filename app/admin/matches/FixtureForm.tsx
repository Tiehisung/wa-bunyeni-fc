"use client";

import { logos } from "@/assets/images";
import { Button } from "@/components/buttons/Button";
import { DateTimeInput, Input } from "@/components/input/Inputs";
import RadioButtons from "@/components/input/Radio";
import ContentShowcaseWrapper from "@/components/ShowcaseWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fireEscape } from "@/hooks/Esc";
import { ISelectOptionLV } from "@/types";
import { useState } from "react";
import { EMatchCategory, IMatch } from "@/types/match.interface";
import {
  useCreateMatchMutation,
  useUpdateMatchMutation,
} from "@/services/match.endpoints";
import { smartToast } from "@/utils/toast";
import { TEAM } from "@/data/team";

import { getDeadlineInfo } from "@/lib/timeAndDate";
import ImageUploader from "@/components/files/ImageUploader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useGetTeamsQuery } from "@/services/team.endpoints";
import { useSession } from "next-auth/react";
import SELECT from "@/components/select/Select";
import { enumToOptions } from "@/lib/select";

// Zod schema for form validation

enum EMatchType {
  HOME = "home",
  AWAY = "away",
}

const matchFormSchema = z.object({
  matchType: z.enum([EMatchType.HOME, EMatchType.AWAY]),
  category: z.enum(EMatchCategory),
  opponentId: z.string().min(11, "Please select an opponent team"),
  date: z.string().min(6, "Match date is required"),
  time: z.string().min(4, "Match time is required"),
  fixtureFlier: z.string().optional(),
});

type MatchFormData = z.infer<typeof matchFormSchema>;

interface MatchFormProps {
  fixture?: IMatch;
}

export const MatchForm = ({ fixture }: MatchFormProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [waiting, setWaiting] = useState(false);
  const [createMatch] = useCreateMatchMutation();
  const [updateMatch] = useUpdateMatchMutation();

  const { data: teamsData } = useGetTeamsQuery({});

  // Determine mode based on fixture
  const isUpdateMode = !!fixture;
  const isLocked =
    isUpdateMode &&
    getDeadlineInfo(fixture?.date as string).isPassed &&
    user?.role !== "super_admin";

  const teamOptions: ISelectOptionLV[] =
    teamsData?.data?.map((t) => ({
      label: t.name,
      value: t._id,
    })) || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MatchFormData>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      matchType: isUpdateMode
        ? fixture?.isHome
          ? EMatchType.HOME
          : EMatchType.AWAY
        : undefined,
      opponentId: isUpdateMode ? fixture?.opponent?._id : "",
      date: isUpdateMode ? fixture?.date?.split("T")?.[0] : "",
      time: isUpdateMode ? fixture?.time : "",
      fixtureFlier: isUpdateMode ? fixture?.fixtureFlier : "",
      category: isUpdateMode ? fixture?.category : EMatchCategory.U13,
    },
  });

  const onSubmit = async (data: MatchFormData) => {
    setWaiting(true);

    console.log(data)

    const opponentTeam = teamsData?.data?.find(
      (t) => t._id === data.opponentId,
    );

    const matchData = {
      ...(isUpdateMode && fixture && { ...fixture }),
      ...data,
      isHome: data.matchType === EMatchType.HOME,
      opponent: opponentTeam || null,
      title:
        data.matchType === EMatchType.HOME
          ? `${TEAM.name} VS ${opponentTeam?.name}`
          : `${opponentTeam?.name} VS ${TEAM.name}`,
    } as Partial<IMatch>;

    try {
      const result = isUpdateMode
        ? await updateMatch(matchData).unwrap()
        : await createMatch(matchData).unwrap();

      if (result.success) {
        fireEscape();
        if (!isUpdateMode) {
          reset({
            matchType: undefined,
            opponentId: "",
            date: "",
            time: "",
            fixtureFlier: "",
            category: EMatchCategory.U13,
          });
        }
      }
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    } finally {
      setWaiting(false);
    }
  };

  if (isLocked) return null;

  // If no fixture, show create mode (full page)

  return (
    <ContentShowcaseWrapper
      images={Object.values(logos) as string[]}
      className="py-6 gap-y-10 items-start gap-5"
      graphicsStyles="md:min-h-[80vh] bg-accent"
    >
      <div className="grow">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">NEW FIXTURE</CardTitle>
            <CardDescription>Fill Out To Create Fixture</CardDescription>
          </CardHeader>
          <CardContent className="max-w-xl sm:min-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Opponent Selection */}
              <Controller
                name="opponentId"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    label="Select Opponent Team *"
                    options={teamOptions}
                    {...field}
                    onChange={field.onChange}
                    className="bg-popover rounded w-full"
                    placeholder="Choose opponent..."
                    error={fieldState.error?.message}
                  />
                )}
              />

              {/* Match Type Radio */}
              <Controller
                name="matchType"
                control={control}
                render={({ field }) => (
                  <RadioButtons
                    defaultValue={field.value}
                    setSelectedValue={field.onChange}
                    values={Object.values(EMatchType)}
                    label="Match Type *"
                    wrapperStyles="flex gap-3 items-center"
                  />
                )}
              />
              {errors.matchType && (
                <p className="text-sm text-red-600 -mt-4">
                  {errors.matchType.message}
                </p>
              )}
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState }) => (
                  <SELECT
                    label="Category"
                    options={enumToOptions(EMatchCategory)}
                    {...field}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
              {/* Date Input */}
              <div>
                <label className="_label mb-2 block text-sm font-medium ">
                  Date Of Play *
                </label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      name="match-date"
                      onChange={field.onChange}
                      type="date"
                      value={field.value}
                      label=""
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              <div>
                <label className="_label mb-2 block text-sm font-medium ">
                  Kick-off Time *
                </label>
                <Controller
                  name="time"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      name="match-time"
                      onChange={field.onChange}
                      type="time"
                      value={field.value}
                      label=""
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>

              {/* Image Upload */}

              <Controller
                name="fixtureFlier"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    label="Fixture Flier (Optional)"
                    onUpload={field.onChange}
                    folder="/fliers"
                    initialImage={field.value}
                    aspectRatio="square"
                    maxSize={5}
                  />
                )}
              />
              {/* Submit Button */}
              <Button
                type="submit"
                waiting={waiting}
                disabled={waiting || isLocked}
                waitingText={isUpdateMode ? "Updating..." : "Saving..."}
                primaryText={isUpdateMode ? "Update Fixture" : "Save Fixture"}
                className=" px-3 py-2 w-full justify-center"
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </ContentShowcaseWrapper>
  );
};
