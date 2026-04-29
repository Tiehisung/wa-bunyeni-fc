"use client";

import { ChevronRight } from "lucide-react";
import { useGetDocumentsQuery } from "@/services/docs.endpoints";
import DataErrorAlert from "@/components/error/DataError";
import { DocFilesDisplay } from "./DocFilesDisplay";
import DisplayType from "@/components/DisplayType";
import { LoadingSpinner } from "@/components/loaders/LoadingSpinner";
import { DocumentUploader } from "./DocUploader";
import Link from "next/link";

export function RecentDocs() {
  const {
    data: recentDocs,
    isLoading,
    error,
  } = useGetDocumentsQuery({ limit: 6 });

  if (isLoading) return <LoadingSpinner />;

  if (error && !isLoading && !recentDocs?.data)
    return <DataErrorAlert message={error} />;

  return (
    <div>
      <header className="items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <DocumentUploader className="w-fit" /> <DisplayType />
        </div>
      </header>
      <main className="mb-6 space-y-2">
        <DocFilesDisplay
          files={recentDocs?.data!}
          showMetadata={true}
          deletable={true}
        />

        <Link
          href="/admin/docs/files"
          className="_link border rounded-full py-2 px-5 flex items-center justify-between gap-3"
        >
          View More <ChevronRight />
        </Link>
      </main>
      <br />
    </div>
  );
}
