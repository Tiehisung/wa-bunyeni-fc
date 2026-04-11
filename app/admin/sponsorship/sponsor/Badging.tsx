"use client";

import { ISponsorProps } from "@/app/sponsorship/page";

export default function DonorBadging({ sponsor }: { sponsor: ISponsorProps }) {
  const badges = String(sponsor?.badges ?? "");
  return (
    <div className="p-2 flex flex-col items-center justify-center" id="badging">
      <h1 className="_title ">DONOR BADGES</h1>
      <div className=" p-5 ">
        <p>Badging is simply tracking the donations by instance.</p>
        <br />
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="font-semibold text-teal-700 text-2xl">
            {sponsor?.businessName}
          </p>
          <span className="animate-out text-5xl text-yellow-100 italic border rounded-full py-4 px-4 bg-cyan-600 text-center">
            {badges}
          </span>
        </div>
      </div>
    </div>
  );
}
