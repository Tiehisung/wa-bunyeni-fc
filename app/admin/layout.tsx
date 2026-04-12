"use client";

import AdminFooter from "./Footer";
import { LeftPaneDesktop, LeftPaneMobileHeadless } from "./AdminSidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import BackBtn from "@/components/buttons/BackBtn";
import Loader from "@/components/loaders/Loader";

import { useAppSelector } from "@/store/hooks/store";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="md:flex relative md:max-h-screen md:overflow-hidden">
      <LeftPaneDesktop />
      <section className=" flex flex-col flex-1 overflow-auto h-full md:h-screen md:max-h-screen">
        <Header />
        <div className=" grow pt-4 md:pt-2 bg-background px-6 pb-10">
          {children}
        </div>{" "}
        <AdminFooter />
      </section>
    </main>
  );
}

const Header = () => {
  const { user, isLoading } = useAppSelector((s) => s.auth);

  const alias = user?.name?.split(" ")?.[0] ?? user?.email?.split("@")?.[0];

  if (isLoading) {
    return (
      <header className="flex justify-between px-6 p-1 sticky top-0.5 bg-accent z-20 items-center border-b border-border backdrop-blur-sm">
        <LeftPaneMobileHeadless />
        <div className="hidden sm:flex items-center gap-4 flex-wrap">
          <BackBtn />
          <Breadcrumbs />
        </div>
        <div className="flex items-center gap-3 text-sm ml-auto divide-x">
          <div className="_label">
            <p className="text-xs italic font-light">Admin</p>
            <Loader size="sm" />
          </div>
          <div className="h-10 w-10 min-h-10 rounded-full bg-muted animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="flex justify-between px-6 p-1 sticky top-0.5 bg-accent z-20 items-center border-b border-border">
      <LeftPaneMobileHeadless />
      <div className="hidden sm:flex items-center gap-4 flex-wrap">
        <BackBtn />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-3 text-sm ml-auto divide-x">
        <div className="_label">
          <p className="text-xs italic font-light">Admin</p>
          <p>{alias}</p>
        </div>
        <img
          src={user?.avatar}
          alt="avatar"
          className="h-10 w-10 min-h-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
};
