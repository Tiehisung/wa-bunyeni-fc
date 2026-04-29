"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  OAuthSignin: "Error starting OAuth sign in.",
  OAuthCallback: "OAuth callback failed.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "Authentication callback failed.",
  AccessDenied: "You do not have permission to sign in.",
  Configuration: "Authentication server misconfiguration.",
  Default: "An unexpected authentication error occurred.",
};

export default function AuthErrorClient() {
  const params = useSearchParams();
  const error = params.get("error") ?? "Default";

  const message = errorMessages[error] ?? errorMessages.Default;

  useEffect(() => {
    console.error("[AUTH ERROR]", {
      error,
      message,
      timestamp: new Date().toISOString(),
    });
  }, [error, message]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold text-destructive">
          Authentication Error
        </h1>

        <p className="text-muted-foreground">{message}</p>

        <div className="flex justify-center gap-3">
          <Link
            href="/auth/signin"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Try Again
          </Link>

          <Link href="/" className="rounded-md border px-4 py-2">
            Go Home
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Error code: <code>{error}</code>
        </p>
      </div>
    </div>
  );
}
