"use client";

import { DragAndDropUpload } from "../../../../../components/DragAndDrop";
 
import { IDocFile } from "@/types/doc";
import {
  useCreateDocumentsMutation,
  useGetFolderDocumentsQuery,
} from "@/services/docs.endpoints";
import { smartToast } from "@/utils/toast";
import TableLoader from "@/components/loaders/Table";
import DataErrorAlert from "@/components/error/DataError";
import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { DocFilesDisplay } from "../../DocFilesDisplay";
import { useParams } from "next/navigation";

export default function FolderDocuments() {
  const { folderId } = useParams<{ folderId: string }>();
  const {
    data: folderDocs,
    isLoading: docsLoading,
    error: docsError,
  } = useGetFolderDocumentsQuery({ folderId: folderId.toString() as string });

  const [uploadeDoc, {}] = useCreateDocumentsMutation();

  const handleUpload = async (docs: IDocFile[]) => {
    try {
      if (docs.length == 0) return;
      const result = await uploadeDoc({
        folderId: folderId as string,
        files: docs,
      }).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  if (docsLoading) {
    return <TableLoader rows={3} cols={3} className="h-24" />;
  }

  if (docsError && !folderDocs) {
    return <DataErrorAlert message={docsError} />;
  }
  return (
    <div>
      <main className="pb-7">
        <DragAndDropUpload
          onChange={(fs) => handleUpload([fs as IDocFile])}
          fileType={"all"}
        >
          <DocFilesDisplay
            files={folderDocs?.data!}
            showMetadata={true}
            deletable={true}
          />
        </DragAndDropUpload>

        <InfiniteLimitScroller
          pagination={folderDocs?.pagination}
          endDataText="No more files"
        />
      </main>
    </div>
  );
}
