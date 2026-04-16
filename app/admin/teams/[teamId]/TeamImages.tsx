"use client";

import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import ImageUploadWidget from "@/components/cloudinary/ImageUploadWidget";
import { H } from "@/components/Element";
import ImageUploader from "@/components/files/ImageUploadComponent";
import { OverlayLoader } from "@/components/loaders/OverlayLoader";
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

      console.log(result);
    } catch (error) {
      smartToast({ error: error });
    }
  };

  return (
    <div>
      <H>Team Featured Images</H>
       
      <ImageUploadWidget
        onUpload={(file) => handleSave(file?.secure_url as string)}
        folder={team?.name.replaceAll(" ", "-")}
        cropping
        shape="square"
        className="max-h-20 shadow-none "
      />

      <div className="grid md:grid-cols-2 2xl:grid-cols-3">
        {team?.images?.map((img, i) => (
          <div key={i} className="h-96 w-full">
            <Image
              src={img}
              alt="team img"
              width={400}
              height={400}
              className="w-full h-full aspect-auto"
            />
          </div>
        ))}
        <OverlayLoader isLoading={updating} />
      </div>
    </div>
  );
}
