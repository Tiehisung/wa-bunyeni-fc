"use client";

import InfiniteLimitScroller from "@/components/InfiniteScroll";
import { PrimarySearch } from "@/components/Search";
import { useGetDocumentsQuery } from "@/services/docs.endpoints";
import DataErrorAlert from "@/components/error/DataError";
import TableLoader from "@/components/loaders/Table";
import { DocFilesDisplay } from "../DocFilesDisplay";
import { sParamsToObject } from "@/lib/searchParams";
import { DocumentUploader } from "../DocUploader";
import { H } from "@/components/Element";
import DisplayType from "@/components/DisplayType";

const AllDocsPage = () => {
  const {
    data: docsData,
    isLoading,
    error,
  } = useGetDocumentsQuery(sParamsToObject());
  const docs = docsData;

  if (isLoading) {
    return <TableLoader cols={1} rows={5} />;
  }

  if (error && !docsData?.data) {
    return <DataErrorAlert message={error} />;
  }

  return (
    <div>
      <H>All Documents</H>

      <header className="flex flex-wrap items-center gap-4 my-4 ">
        <PrimarySearch
          type="search"
          listId="docs-search"
          searchKey="doc_search"
          placeholder="Search document"
          inputStyles="h-8 placeholder:capitalize"
          className=""
        />{" "}
        <DisplayType />
        <DocumentUploader className="w-fit " />
      </header>

      <DocFilesDisplay
        files={docs?.data!}
        showMetadata={true}
        deletable={true}
      />
      <InfiniteLimitScroller pagination={docs?.pagination} />
    </div>
  );
};

export default AllDocsPage;
