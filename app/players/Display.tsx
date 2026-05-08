'use client'

import Loader from "@/components/loaders/Loader";
import { getAgeFromDOB } from "@/lib/timeAndDate";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";

const DEFAULT_AVATAR = "/images/placeholder-player.png";

export default function OurPlayers() {
  const { data, isLoading } = useGetPlayersQuery({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (isLoading) return <Loader />;

  const players = data?.data;

  const handleImageError = (playerId: string) => {
    setFailedImages(prev => ({ ...prev, [playerId]: true }));
  };

  const getImageSrc = (player: any) => {
    if (failedImages[player._id]) return DEFAULT_AVATAR;
    return (player?.featureMedia?.[0]?.secure_url || player?.avatar || DEFAULT_AVATAR);
  };

  return (
    <div className="py-6">
      <ul className="space-y-5">
        {players?.map((player) => (
          <li key={player._id} className="border-b border-primary pb-6">
            <h2 className="font-bold">#{player?.number}</h2>

            <div className="text-Blue text-2xl my-4">
              <Link
                href={`/players/${player?.slug || player?._id}`}
                className="_link"
              >
                {`${player?.lastName} ${player?.firstName}`}
              </Link>
            </div>

            <h1 className="capitalize mb-3">
              Age: <strong>{getAgeFromDOB(player.dob)}</strong> | Position:{" "}
              <strong>{player.position}</strong> | Status:{" "}
              <strong>{player.status}</strong> | Height:{" "}
              <strong>{player.height} FT</strong>
            </h1>

            {/* Fixed Image Container */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              {/* Image Container - Fixed width on desktop, full on mobile */}
              <div className="relative w-full md:w-80 lg:w-96 h-80 md:h-96 lg:h-[400px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={getImageSrc(player)}
                  alt={player?.lastName || "Player image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={false}
                  onError={() => handleImageError(player._id)}
                />
              </div>

              {/* Description Content - Takes remaining space */}
              <div
                dangerouslySetInnerHTML={{
                  __html: (player?.description ?? player?.about) as string,
                }}
                className="flex-1 mt-0 prose prose-sm max-w-none"
              />
            </section>
          </li>
        ))}
      </ul>
    </div>
  );
}