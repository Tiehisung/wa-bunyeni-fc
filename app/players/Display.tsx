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
            <div className="relative w-full max-w-2xl h-80 md:h-96 lg:h-[400px] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={getImageSrc(player)}
                alt={player?.lastName || "Player image"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                priority={false}
                onError={() => handleImageError(player._id)}
              />
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: (player?.description ?? player?.about) as string,
              }}
              className="mt-6"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}