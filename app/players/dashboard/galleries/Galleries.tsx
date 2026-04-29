 "use client";


import GalleryGrid from "@/components/Gallery/GallaryGrid";
import { SlicePagination } from "@/components/pagination/SlicePagination";
import { PrimarySearch } from "@/components/Search";
import { IQueryResponse } from "@/types";
import { IGallery } from "@/types/file.interface";
import { IPlayer } from "@/types/player.interface";
import { useState } from "react";

export function PlayerGalleriesClient({
  galleries,
}: {
  player?: IPlayer;
  galleries?: IQueryResponse<IGallery[]>;
}) {
  const [data, setData] = useState<IGallery[]>(galleries?.data ?? []);

  return (
    <div className="grid gap-2 _page">
      <h3 className="text-lg font-semibold mb-4 _title"> Galleries</h3>

      <div className="pb-4 space-y-3">
        <PrimarySearch searchKey="search" />
        <GalleryGrid galleries={data} />

        <SlicePagination onPageChange={setData} data={galleries?.data} />
      </div>
    </div>
  );
}
