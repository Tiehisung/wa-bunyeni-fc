"use client";

import FolderDocuments from "./FolderDocs";
import { DocumentUploader } from "../../DocUploader";
import { PrimarySearch } from "@/components/Search";
import { useGetPlayersQuery } from "@/services/player.endpoints";
import DisplayType from "@/components/DisplayType";
 import { useGetFolderByIdQuery } from "@/services/docs.endpoints";
import { H } from "@/components/Element";
import { useParams } from "next/navigation";

export default function FolderPage() {
  // Fetch players for tagging
  const { data: players } = useGetPlayersQuery("");
  const { folderId } = useParams<{ folderId: string }>();

  const { data: folder } = useGetFolderByIdQuery(folderId as string);
  return (
    <div>
      <header>
        <H>{folder?.data?.name}</H>
        <div className="flex flex-wrap items-center justify-between gap-4 my-3.5">
          <DocumentUploader className="w-fit " /> <DisplayType />
          <PrimarySearch
            type="search"
            datalist={(players?.data ?? [])?.map(
              (p) => `${p?.firstName} ${p?.lastName}`,
            )}
            listId="folder-search"
            searchKey="doc_search"
            placeholder={`Search docs`}
            inputStyles="h-8 placeholder:capitalize"
            className=""
          />
        </div>
      </header>

      <FolderDocuments />
    </div>
  );
}
