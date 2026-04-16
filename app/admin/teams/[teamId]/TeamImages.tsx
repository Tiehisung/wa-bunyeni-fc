"use client";

import SingleImageUploadWidget from "@/components/cloudinary/SingleImageUploadWidget";
import { H } from "@/components/Element";
import { OverlayLoader } from "@/components/loaders/OverlayLoader";
import { getSafeName } from "@/lib/sanitizer.utils";
import { useUpdateTeamMutation } from "@/services/team.endpoints";
import { ITeam } from "@/types/match.interface";
import { smartToast } from "@/utils/toast";
import Image from "next/image";

export function TeamImages({ team }: { team?: ITeam }) {
  const [updateTeam, { isLoading: updating }] = useUpdateTeamMutation();

  const handleSave = async (url: string) => {
    try {
      const result = await updateTeam({
        _id: team?._id as string,
        images: [url, ...(team?.images || [])],
      }).unwrap();
      smartToast(result);
 
    } catch (error) {
      smartToast({ error: error });
    }
  };

  return (
    <div>
      <H>Team Featured Images</H>

      <SingleImageUploadWidget
        onUpload={(file) => handleSave(file?.secure_url as string)}
        folder={getSafeName(team?.name as string)}
        cropping
      />

      <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-3 mt-4">
        {team?.images?.map((img, i) => (
          <div key={i} className="h-96 w-full rounded overflow-hidden">
            <Image
              src={img}
              alt="team img"
              width={400}
              height={400}
              className="w-full h-full aspect-auto object-cover"
            />
          </div>
        ))}
        <OverlayLoader isLoading={updating} />
      </div>
    </div>
  );
}
