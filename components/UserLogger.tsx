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
        : "/admin";
    return (
      <div className="grid md:flex items-center gap-6 md:gap-2">
        {!(session?.user as ISession["user"])?.role?.includes("guest") ? (
          <Link
            href={path}
            className=" border _borderColor hover:ring rounded px-2 py-1 h-full"
          >
            {session?.user?.name?.split(" ")?.[0] ?? "Dashboard"}
          </Link>
        ) : (
          <span> Guest</span>
        )}

      
      </div>
    );
  }
  return <LoginModal trigger="Sign In" />;
}
