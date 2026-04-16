"use client";

import { Button } from "@/components/buttons/Button";
import SingleImageUploadWidget from "@/components/cloudinary/SingleImageUploadWidget";
import { PrimaryDropdown } from "@/components/Dropdown";
import { H } from "@/components/Element";
import { OverlayLoader } from "@/components/loaders/OverlayLoader";
import { fireEscape } from "@/hooks/Esc";
import { getSafeName } from "@/lib/sanitizer.utils";
import { useUpdateTeamMutation } from "@/services/team.endpoints";
import { ITeam } from "@/types/match.interface";
import { smartToast } from "@/utils/toast";
import { Trash } from "lucide-react";
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

      // router.refresh();
    } catch (error) {
      smartToast({ error: error });
    }
  };
  const handleDelete = async (url: string) => {
    try {
      await updateTeam({
        _id: team?._id as string,
        images: team?.images?.filter((img) => img !== url),
      }).unwrap();
      fireEscape()
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
          <div key={i} className="h-96 w-full rounded overflow-hidden relative">
            <PrimaryDropdown
              triggerStyles="absolute right-4 top-1 flex items-center justify-center z-10"
              className="py-4 px-2"
            >
              <Button
           
                onClick={() => handleDelete(img)}
                className="shadow w-full justify-start"
                size="sm"
                variant={"outline"}
              >
                <Trash /> Delete
              </Button>
            </PrimaryDropdown>
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
