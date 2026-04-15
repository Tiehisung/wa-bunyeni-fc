import { LoginBtn } from "@/components/auth/Auth";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { ISession, IUser } from "@/types/user";
import { IPageProps } from "@/types";
import TextDivider from "@/components/Divider";
import { CredentialsLoginForm } from "./Credentials";
import { auth } from "@/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AVATAR } from "@/components/ui/avatar";
import { getInitials } from "@/lib";

const LoginPage = async ({ searchParams }: IPageProps) => {
  const callbackUrl = (await searchParams).callbackUrl ?? "/";

  // console.log({ callbackUrl });
  const error = (await searchParams).error;

  const message = errorMessages[error || ""] || errorMessages.Default;
  const session = await auth();

  if (session?.user) {
    const user = session.user as ISession["user"];
    const path =
      (user as IUser).role == "player" ? "/players/dashboard" : "/admin";
    return (
      <div className="min-h-screen flex flex-col gap-2.5 justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">You are already logged in</h1>
        <AVATAR
          src={user?.image as string}
          fallbackText={getInitials(user?.name as string)}
          
        />
        <p className="text-center">
          Go to{" "}
          <Link href={path} className="text-blue-500 underline">
            Dashboard
          </Link>{" "}
          as{" "}
          <span className="italic font-light text-muted-foreground bg-secondary">
            {user?.name}
          </span>
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col pt-20 items-center">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="px-4 flex flex-col gap-5 rounded-2xl min-w-2xs md:min-w-xl max-w-md mx-auto border py-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Error code</AlertTitle>
            <AlertDescription className="text-xs ">{message}</AlertDescription>
          </Alert>
        )}

        <LoginBtn
          text="Sign In with Google"
          variant={"outline"}
          redirectTo={callbackUrl}
        >
          <FcGoogle size={24} />
        </LoginBtn>

        <TextDivider />

        <CredentialsLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

const errorMessages: Record<string, string> = {
  OAuthSignin: "Could not start Google sign-in.",
  OAuthCallback: "Google sign-in failed. Please try again.",
  OAuthCreateAccount: "Could not create your Google account.",
  EmailCreateAccount: "Could not create email account.",
  EmailSignin: "Failed to send login email.",
  CredentialsSignin: "Invalid email or password.",
  Verification: "This login link is invalid or expired.",
  AccountNotLinked: "This email is already linked to another provider.",
  AccessDenied: "You do not have permission to sign in.",
  Configuration: "Authentication server misconfiguration.",
  Callback: "Authentication callback failed.",
  Default: "Something went wrong. Please try again.",
};
