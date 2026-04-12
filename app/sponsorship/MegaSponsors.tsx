"use client";

import { staticImages } from "@/assets/images";
import { useGetSponsorsQuery } from "@/services/sponsor.endpoints";

export function MegaSponsors() {
  const { data: sponsors, isLoading } = useGetSponsorsQuery("");

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <h1 className="bg-modalOverlay text-white px-2">
          Mega sponsors {new Date().getFullYear()}
        </h1>
        <br />
        <div className="h-1 w-full bg-linear-to-r from-Red via-Orange to-Red/75" />
        <br />
        <div className="flex items-center _marquee">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 w-fit h-fit">
              <div className="h-20 w-20 rounded-2xl bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 mt-2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!sponsors?.data?.length) {
    return null;
  }

  return (
    <div>
      <h1 className="bg-modalOverlay text-white px-2">
        Mega sponsors {new Date().getFullYear()}
      </h1>
      <br />
      <div className="h-1 w-full bg-linear-to-r from-Red via-Orange to-Red/75" />
      <br />
      <div className="flex items-center _marquee">
        {sponsors?.data?.slice(0, 10)?.map((sponsor, index) => (
          <div
            key={sponsor._id || index}
            className="p-4 w-fit h-fit rounded-2xl hover:bg-slate-400/30 transition-colors"
          >
            <img
              src={sponsor?.logo ?? staticImages.sponsor}
              alt={sponsor?.businessName || sponsor?.name}
              className="h-20 w-20 min-w-20 rounded-2xl object-cover bg-base-100"
            />
            <p className="max-w-24 line-clamp-1 _label text-center">
              {sponsor?.businessName || sponsor?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
