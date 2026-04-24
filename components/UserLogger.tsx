"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ISession } from "@/types/user";
import LoginModal from "./auth/Login";
import Loader from "./loaders/Loader";

export default function UserLogButtons() {
  const { data: session, status } = useSession();

  if (status == "loading") return <Loader message="" />;

  if (session) {
    const path =
      (session?.user as ISession["user"])?.role == "player"
        ? `/players/dashboard`
        : session?.user?.role?.includes("admin")
          ? "/admin"
          : "/fans";
    return (
      <div className="grid md:flex items-center gap-6 md:gap-2">
        <Link
          href={path}
          className=" border border-border hover:ring rounded px-2 py-1 h-full"
        >
          {session?.user?.name?.split(" ")?.[0] ?? "Dashboard"}
        </Link>
      </div>
    );
  }
  return <LoginModal trigger="Sign In" />;
}
