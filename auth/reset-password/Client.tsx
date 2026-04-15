"use client";

import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";
import { getErrorMessage } from "@/lib/error";
import { AlertCircle, LogIn } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { apiConfig } from "@/lib/configs";
import { useState } from "react";

export const passwordResetSchema = z.object({
  username: z.string().min(1, "Username is required"),
  fullname: z.string().min(1, "Fullname is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type PasswordResetForm = z.infer<typeof passwordResetSchema>;

export default function PasswordResetClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultUsername = searchParams.get("username");
  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      username: defaultUsername || "",
      fullname: "",
      password: "",
    },
  });

  const onSubmit = async (data: PasswordResetForm) => {
    try {
      const response = await fetch(apiConfig.credentialSignin, {
        method: "PUT",
        body: JSON.stringify({
          email: data.username,
          password: data.password,
          name: data.fullname,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (!result.success) {
        toast.error(result.message);
        setError(result.message);
        return;
      }

      toast.success(result.message??'Reset successful');

      setTimeout(() => {
        router.replace(`/auth/signin?username=${watch("username")}`);
      }, 2000);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setError(getErrorMessage(err));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 pb-8 p-5 min-w-2xs grow max-w-3xl"
    >
      <h1 className="text-xl mb-3.5">Reset Password</h1>
      {/* Username */}
      <Controller
        control={control}
        name="username"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            {...field}
            label="Username"
            wrapperStyles="mt-6"
            error={fieldState.error?.message}
          />
        )}
      />

      {/* Fullname */}
      <Controller
        control={control}
        name="fullname"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            {...field}
            label="Fullname"
            wrapperStyles="mt-6"
            error={fieldState.error?.message}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <IconInputWithLabel
            {...field}
            label="Password"
            type="password"
            error={fieldState.error?.message}
          />
        )}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Password Reset Error</AlertTitle>
          <AlertDescription className="text-xs ">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        primaryText="Reset password"
        waiting={isSubmitting}
        waitingText="Resetting..."
        type="submit"
        className="_primaryBtn p-2 grow w-full justify-center"
        variant="secondary"
      >
        <LogIn className="w-4 h-4" />
      </Button>

      <Separator className="mb-3 mt-9" />
      <Button
        primaryText={"Sign In instead"}
        onClick={() =>
          router.replace(`/auth/signin?username=${watch("username")}`)
        }
        variant={"link"}
      />
    </form>
  );
}
