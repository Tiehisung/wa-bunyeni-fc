"use client";

import Link from "next/link";
import Loader from "./loaders/Loader";
import LoginController from "./auth/LoginModal";
import { LogoutBtn } from "./auth/LogoutButton";
import { useAuth } from "@/store/hooks/useAuth";

export default function UserLogButtons() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader message="" />;

  if (user) {
    const path =
      user?.role == "player"
        ? "/players/dashboard"
        : user?.role?.includes("admin")
          ? "/admin"
          : "";
    return (
      <div className="grid md:flex items-center gap-6 md:gap-2">
        {!user?.role?.includes("guest") ? (
          <Link
            href={path}
            className="hidden md:block border _borderColor hover:ring rounded px-2 py-1 h-full"
          >
            { user?.name?.split(" ")?.[0] ?? "Dashboard"}
          </Link>
        ) : (
          <span> Guest</span>
        )}

        <LogoutBtn variant={"destructive"} size={"sm"} />
      </div>
    );
  }
  return <LoginController trigger="Sign In" />;
}
