import { ReactNode } from "react";
import SponsorActionsBar from "./ActionsBar";

export default function SponsorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <SponsorActionsBar />
      <br />
      <div className="flex flex-col justify-center items-center min-w-[60%]">
        {children}
      </div>
    </div>
  );
}
