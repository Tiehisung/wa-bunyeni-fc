"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "../buttons/Button";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { getUrlToShare } from "@/lib";

interface IProps {
  className?: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  text?: string;
  children?: React.ReactNode;
  redirectTo?: string;
  stayOnPage?: boolean;
}

export const LoginBtn = ({
  className,
  size,
  variant,
  text = "Login",
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
      {children ?? <LogIn className="w-4 h-4 " />}
    </Button>
  );
};

export const LogoutBtn = ({
  className,
  size,
  variant = "destructive",
  text = "",
  children,
  redirectTo = "/",
  stayOnPage = false,
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await signOut(stayOnPage ? { redirect: true } : { redirectTo });
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  };
  return (
    <Button
      className={className}
      onClick={handleLogout}
      variant={variant ?? "destructive"}
      size={size}
      waiting={loading}
      primaryText={text}
      waitingText=""
    >
      {children ?? <LogOut className="w-4 h-4 " />}
    </Button>
  );
};
