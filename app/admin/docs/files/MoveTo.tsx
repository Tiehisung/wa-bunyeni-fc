"use client";

import { DIALOG } from "@/components/Dialog";
import { ReactNode, useState } from "react";
import { IDocFile } from "@/types/doc";
import {
  useGetFoldersQuery,
  useMoveDocumentsMutation,
} from "@/services/docs.endpoints";
import { smartToast } from "@/utils/toast";
import { Button } from "@/components/buttons/Button";
import { Folder } from "lucide-react";
import { OverlayLoader } from "@/components/loaders/OverlayLoader";

interface IProps {
  document?: IDocFile;
   trigger: ReactNode;
}
export function DocMoveTo({ document, trigger }: IProps) {
  const { data: foldersData, isLoading } = useGetFoldersQuery({});

  const otherFolders = foldersData?.data?.filter(
    (f) => f._id !== document?.folder?._id,
  ); //Exclude the source folder

  const [moveFile, { isLoading: moving }] = useMoveDocumentsMutation();
  const [loadingFolderId, setLoadingFolderId] = useState("");

  const handleMove = async (destFolderId: string) => {
    try {
      setLoadingFolderId(destFolderId);
      const result = await moveFile({
        destinationFolderId: destFolderId,
        fileIds: [document?._id as string],
      }).unwrap();
      smartToast(result);
    } catch (error) {
      console.log(error);
      smartToast({ error });
    }
  };

  return (
    <DIALOG
      trigger={trigger}
      variant={"ghost"}
      triggerStyles="w-full justify-start font-normal"
      isLoading={isLoading}
      title={"Move File"}
    >
      <header className="flex flex-col gap-3 justify-center items-center">
        <h1>
          {"Move "}
          <span className={"italic text-muted-foreground underline"}>
            {document?.original_filename}
          </span>{" "}
          from{" "}
          <span className="text-primary font-semibold">
            {document?.folder?.name}
          </span>
          {" to"}
        </h1>
      </header>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {otherFolders?.map((fold) => (
          <Button
            key={fold?._id}
            onClick={() => handleMove(fold?._id as string)}
            className=" text-sm font-normal justify-start text-left w-full "
            variant="secondary"
            waiting={moving && loadingFolderId == fold?._id}
            disabled={moving}
          >
            <Folder /> <span className="line-clamp-1 ">{fold?.name}</span>
          </Button>
        ))}
      </div>
      <OverlayLoader isLoading={moving} blur={false} />
    </DIALOG>
  );
}
