"use client";

import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";

import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { fireEscape } from "@/hooks/Esc";
import { apiConfig } from "@/lib/configs";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ISession } from "@/types/user";
import { getErrorMessage } from "@/lib/error";

export const credentialsLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type CredentialsLoginFormData = z.infer<typeof credentialsLoginSchema>;

export const CredentialsLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/players/dashboard";

  const [error, setError] = useState("");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<CredentialsLoginFormData>({
    resolver: zodResolver(credentialsLoginSchema),
    defaultValues: {
      username: searchParams.get("username") ?? "",
      password: "",
    },
  });

  const onSubmit = async (data: CredentialsLoginFormData) => {
    try {
      setError("");
      const response = await fetch(apiConfig.credentialSignin, {
        method: "POST",
        body: JSON.stringify({
          email: data.username,
          password: data.password,
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

      toast.success(result.message);
      const safeUser: ISession["user"] = result.data;
      await signIn("credentials", {
        // redirect: false,
        redirectTo: callbackUrl,
        user: JSON.stringify(safeUser),
      });

      setTimeout(() => {
        fireEscape();
      }, 3000);

      // router.push(res.url || callbackUrl);
      // window.location.href = res.url || callbackUrl;
    } catch (err) {
      toast.error(getErrorMessage(err));
      setError(getErrorMessage(err));
    }
  };

  return (
    <main
      className={`${
        isSubmitting ? "pointer-events-none opacity-70 cursor-wait" : ""
      }  `}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`  flex flex-col gap-8 pb-8 p-5 pt-0 min-w-2xs grow`}
      >
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
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription className="text-xs ">{error}</AlertDescription>
          </Alert>
        )}
        <Button
          primaryText="Sign in"
          waiting={isSubmitting}
          waitingText="Signing in..."
          type="submit"
          className=" p-2 grow w-full justify-center"
        >
          <LogIn className="w-4 h-4" />
        </Button>
      </form>
      <Separator className="my-3" />
      <Button
        primaryText={"Sign In instead"}
        onClick={() => {
          router.replace(`/auth/reset-password?username=${watch("username")}`);
          setTimeout(() => {
            fireEscape();
          }, 2000);
        }}
        variant={"link"}
      />
    </main>
  );
};
