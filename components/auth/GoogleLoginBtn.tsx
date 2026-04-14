'use client'

import { signIn } from "next-auth/react";
import { Button } from "../buttons/Button";
import { useState } from "react";
import { getUrlToShare } from "@/lib";
import { TButtonVariant, TButtonSize } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

interface IProps {
  className?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  text?: string;
  children?: React.ReactNode;
  redirectTo?: string;
  stayOnPage?: boolean;
}

export const GoogleLoginBtn = ({
  className,
  size,
  variant,
  text = "Sign in with google",
  children,
  redirectTo = getUrlToShare(),
  stayOnPage = false,
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    await signIn("google", { redirectTo: redirectTo });

    setTimeout(() => {
      setLoading(false);
    }, 4000);
  };

  return (
    <Button
      onClick={handleLogin}
      className={className}
      size={size}
      variant={variant ?? "default"}
      waiting={loading}
      primaryText={text}
      waitingText=""
    >
      {children ?? <FcGoogle size={24} />}
    </Button>
  );
};