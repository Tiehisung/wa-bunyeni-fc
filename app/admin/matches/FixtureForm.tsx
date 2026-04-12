"use client";

import { logos } from "@/assets/images";
import { Button } from "@/components/buttons/Button";
import { DateTimeInput } from "@/components/input/Inputs";
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
import { IMatch } from "@/types/match.interface";
import {
  useCreateMatchMutation,
  useUpdateMatchMutation,
} from "@/services/match.endpoints";
import { smartToast } from "@/utils/toast";
import { TEAM } from "@/data/team";
import { useAuth } from "@/store/hooks/useAuth";
import { getDeadlineInfo } from "@/lib/timeAndDate";
import { ImageUploader } from "@/components/files/image-uploader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useGetTeamsQuery } from "@/services/team.endpoints";
import { COMBOBOX } from "@/components/ComboBox";

// Zod schema for form validation

enum EMatchType {
  HOME = "home",
  AWAY = "away",
}

const matchFormSchema = z.object({
  matchType: z.enum([EMatchType.HOME, EMatchType.AWAY]),
  opponentId: z.string().min(1, "Please select an opponent team"),
  date: z.string().min(1, "Match date is required"),
  time: z.string().min(1, "Match time is required"),
  fixtureFlier: z.string().optional(),
});

type MatchFormData = z.infer<typeof matchFormSchema>;

interface MatchFormProps {
  fixture?: IMatch;
}

export const MatchForm = ({ fixture }: MatchFormProps) => {
  const { user } = useAuth();
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
    formState: { errors, isValid },
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
    },
  });

  const onSubmit = async (data: MatchFormData) => {
    setWaiting(true);

    const opponentTeam = teamsData?.data?.find(
      (t) => t._id === data.opponentId,
    );

    const matchData = {
      date: data.date,
      time: data.time,
      isHome: data.matchType === EMatchType.HOME,
      opponent: opponentTeam || null,
      title:
        data.matchType === EMatchType.HOME
          ? `${TEAM.name} VS ${opponentTeam?.name}`
          : `${opponentTeam?.name} VS ${TEAM.name}`,
      fixtureFlier: data.fixtureFlier,
      ...(isUpdateMode && fixture && { ...fixture }),
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
              <div>
                <label className="_label mb-2 block text-sm font-medium">
                  Select Opponent Team *
                </label>
                <Controller
                  name="opponentId"
                  control={control}
                  render={({ field }) => (
                    <COMBOBOX
                      options={teamOptions}
                      onChange={(option: any) => field.onChange(option?.value)}
                      className="bg-popover rounded w-full"
                      defaultOptionValue={field.value}
                      placeholder="Choose opponent..."
                    />
                  )}
                />
                {errors.opponentId && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.opponentId.message}
                  </p>
                )}
              </div>

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

              {/* Date Input */}
              <Controller
                name="date"
                control={control}
                render={({ field, fieldState }) => (
                  <DateTimeInput
                    name="match-date"
                    onChange={field.onChange}
                    type="date"
                    required
                    value={field.value}
                    label="Date Of Play *"
                    error={fieldState.error?.message}
                  />
                )}
              />

              {/* Time Input */}
              <Controller
                name="time"
                control={control}
                render={({ field, fieldState }) => (
                  <DateTimeInput
                    name="match-time"
                    onChange={field.onChange}
                    type="time"
                    required
                    label="Time Of Play *"
                    value={field.value}
                    error={fieldState.error?.message}
                  />
                )}
              />

              {/* Image Upload */}
              <div>
                <label className="_label mb-2 block text-sm font-medium text-gray-700">
                  Fixture Flier (Optional)
                </label>
                <Controller
                  name="fixtureFlier"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      onUpload={field.onChange}
                      folder="/fliers"
                      initialImage={field.value}
                      aspectRatio="square"
                      maxSize={5}
                    />
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                waiting={waiting}
                disabled={waiting || !isValid || isLocked}
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
