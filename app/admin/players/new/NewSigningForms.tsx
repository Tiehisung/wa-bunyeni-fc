"use client";

import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/input/Inputs";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DiveUpwards from "@/components/Animate";
import { EPlayerPosition, IPlayer } from "@/types/player.interface";
import SELECT from "@/components/select/Select";
import { enumToOptions } from "@/lib/select";
import QuillEditor from "@/components/editor/Quill";
import {
  useCreatePlayerMutation,
  useUpdatePlayerMutation,
} from "@/services/player.endpoints";
import { smartToast } from "@/utils/toast";
import ImageUploader from "@/components/files/ImageUploader";

// Zod Schemas
const playerManagerSchema = z.object({
  fullname: z.string().min(2, "Manager fullname is required").max(50),
  phone: z
    .string()
    .regex(/^[0-9]{7,15}$/, "Phone must contain only digits (7–15 chars)"),
});

const playerSchema = z.object({
  firstName: z.string().min(2, "First name is required").max(30),
  lastName: z.string().min(2, "Last name is required").max(30),
  about: z.string().max(3000).optional().default(""),
  position: z.enum(EPlayerPosition),
  number: z.coerce.number().positive().min(1).max(99),
  dateSigned: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Date signed must be a valid date",
  }),
  height: z.coerce.number().positive().min(3).max(8),
  phone: z
    .string()
    .regex(/^[0-9]{7,15}$/, "Phone must contain only digits (7–15 chars)"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)) && new Date(val) < new Date(), {
      message: "Date of birth must be valid and in the past",
    }),
  avatar: z
    .string()
    .url("Invalid image URL")
    .min(1, "Profile photo is required"),
  manager: playerManagerSchema,
});

export type IPostPlayer = z.infer<typeof playerSchema>;

export default function PlayerProfileForm({
  player = null,
}: {
  player?: IPlayer | null;
}) {
  const [createPlayer, { isLoading: creating }] = useCreatePlayerMutation();
  const [updatePlayer, { isLoading: updating }] = useUpdatePlayerMutation();

  const { control, handleSubmit, reset } = useForm<IPostPlayer>({
    resolver: zodResolver(playerSchema) as Resolver<IPostPlayer>,
    defaultValues: {
      firstName: player?.firstName || "",
      lastName: player?.lastName || "",
      number: Number(player?.number) || 5,
      dateSigned: player?.dateSigned?.split("T")?.[0] || "",
      height: player?.height || 3.5,
      phone: player?.phone || "0211111111",
      about: player?.about || "",
      email: player?.email || "",
      dob: player?.dob?.split("T")?.[0] || "",
      avatar: player?.avatar || "",
      position: player?.position as EPlayerPosition,
      manager: player?.manager
        ? {
            fullname: player.manager.fullname || "",
            phone: player.manager.phone || "0211111111",
          }
        : {
            fullname: "",
            phone: "0211111111",
          },
    },
  });

  const onSubmit = async (data: IPostPlayer) => {
    try {
      let result;
      if (player) {
        result = await updatePlayer({
          _id: player._id,
          ...data,
        } as Partial<IPlayer>).unwrap();
      } else {
        result = await createPlayer(data).unwrap();
      }

      if (result.success) reset();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <section className="bg-card py-6 rounded-2xl flex items-start">
      <form onSubmit={handleSubmit(onSubmit)} 
      className=" w-full max-w-md mx-auto">
        <div className="flex flex-col gap-10">
          <h1 className="text-center">
            {player ? "Edit Player Profile" : "New Player Signup"}
          </h1>

          {/* Personal Information */}
          <div className="p-3 grid gap-8 md:min-w-md lg:min-w-lg">
            <Controller
              control={control}
              name="avatar"
              render={({ field: { value, onChange }, fieldState }) => (
                <div className=" flex-col items-center gap-2 w-fit ">
                  <ImageUploader
                    onUpload={(url) => onChange(url ?? "")}
                    folder="players-avatar"
                    initialImage={value}
                    aspectRatio="square"
                    maxSize={5}
                    label="Player Avatar"
                    imageClassNames="max-h-60 max-w-64"
                  />

                  {fieldState.error && (
                    <p className="text-red-500 text-xs">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <h2 className="_label ">PERSONAL INFORMATION</h2>
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState }) => (
                <Input
                  label="First Name"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState }) => (
                <Input
                  label="Last Name"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="number"
              render={({ field, fieldState }) => (
                <Input
                  type="number"
                  label="Jersey Number"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="position"
              render={({ field, fieldState }) => (
                <SELECT
                  label="Player Position"
                  options={enumToOptions(EPlayerPosition)}
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  selectStyles="w-full capitalize"
                  className="capitalize block space-y-2"
                />
              )}
            />
            <Controller
              control={control}
              name="height"
              render={({ field, fieldState }) => (
                <Input
                  type="number"
                  others={{ step: "0.1" }}
                  label="Height (ft)"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <Input
                  label="Phone"
                  type="tel"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  label="Email"
                  type="email"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="dob"
              render={({ field, fieldState }) => (
                <Input
                  type="date"
                  label="Date of Birth"
                  {...field}
                  error={fieldState.error?.message}
                  value={field.value?.split("T")[0] || ""}
                />
              )}
            />
            <Controller
              control={control}
              name="dateSigned"
              render={({ field, fieldState }) => (
                <Input
                  type="date"
                  label="Date Signed"
                  {...field}
                  error={fieldState.error?.message}
                  value={field.value?.split("T")[0] || ""}
                />
              )}
            />
            <Controller
              control={control}
              name="about"
              render={({ field, fieldState }) => (
                <QuillEditor
                  label="About this Player"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          {/* Manager Section */}
          <div className="p-3 grid gap-8 md:min-w-md lg:min-w-lg">
            <h2 className="_label mb-5 border-b">MANAGER</h2>

            <Controller
              control={control}
              name="manager.fullname"
              render={({ field, fieldState }) => (
                <Input
                  label="Full Name"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="manager.phone"
              render={({ field, fieldState }) => (
                <Input
                  label="Phone"
                  type="tel"
                  {...field}
                  error={fieldState.error?.message}
                />
              )}
            />

            <Button
              type="submit"
              waiting={player ? updating : creating}
              waitingText="Please wait..."
              primaryText={player ? "Update Player" : "Create Player"}
              className="justify-center px-12 h-10 py-1 w-full flex-wrap-reverse"
              variant={"default"}
            />
          </div>
        </div>
      </form>
    </section>
  );
}
