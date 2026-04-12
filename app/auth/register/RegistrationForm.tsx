"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconInputWithLabel } from "@/components/input/Inputs";
import SELECT, {   } from "@/components/select/Select";
import { enumToOptions } from "@/lib/select";
import { Button } from "@/components/buttons/Button";
import { smartToast } from "@/utils/toast";
import { useRegisterMutation } from "@/services/auth.endpoints";
import { IRegisterCredentials } from "@/types/auth";
import { EUserRole } from "@/types/user";
import Link from "next/link";
 

export default function RegistrationForm() {
  const [register] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: EUserRole.FAN },
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      const result = await register(data as IRegisterCredentials).unwrap();

      smartToast(result);
      if (result.success) {
        reset({ name: "", email: "", password: "", role: EUserRole.FAN });
      }
    } catch (e:any) {
 
      smartToast({ error: e });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md space-y-8 py-5 mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Registration</h2>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            label="Name"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            label="Email"
            type="email"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            label="Password"
            type="password"
            error={fieldState.error?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="role"
        render={({ field, fieldState }) => (
          <SELECT
            options={enumToOptions(EUserRole)}
            value={field.value}
            onChange={field.onChange}
            className=" w-full grid"
            selectStyles="border"
            label={<p className="text-muted-foreground -mt-5">Role</p>}
            error={fieldState.error?.message}
            disabled
          />
        )}
      />
      <Button
        primaryText={"Register"}
        waiting={isSubmitting}
        waitingText={"Registering..."}
        type="submit"
        className="p-2 grow w-full justify-center "
      />
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export const createUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(4, "Minimum 4 characters")
    .optional()
    .refine((val) => !val || val.length >= 4, {
      message: "Password must be at least 4 characters",
    }),
  role: z.enum(EUserRole),
  image: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
