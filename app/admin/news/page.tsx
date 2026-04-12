"use client";

import AdminNews from "./News";
import { useGetNewsQuery } from "@/services/news.endpoints";
import { Plus } from "lucide-react";
import { Button } from "@/components/buttons/Button";
import TableLoader from "@/components/loaders/Table";
import { useIsMobile } from "@/hooks/use-mobile";
import { H } from "@/components/Element";
import DataErrorAlert from "@/components/error/DataError";
import { getErrorMessage } from "@/lib/error";
import { useRouter, useSearchParams } from "next/navigation";

const AdminNewsPage = () => {
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();

  const { data: news, isLoading, error } = useGetNewsQuery(paramsString);
  const router = useRouter();
  const ismobile = useIsMobile();

  if (isLoading) {
    return (
      <div>
        <h1 className="_title px-6 text-primaryRed uppercase">
          News Publisher
        </h1>
        <div className="flex justify-center items-center min-h-100">
          <TableLoader
            className="h-24 rounded-md"
            cols={ismobile ? 1 : 3}
            rows={ismobile ? 2 : 3}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <H>News Publisher</H>

        <DataErrorAlert message={getErrorMessage(error)} />
      </div>
    );
  }

  return (
    <div>
      <header className="flex items-center gap-4 px-3 flex-wrap justify-between uppercase">
        <H>News Publisher </H>
        <Button onClick={() => router.push("/admin/news/create-news")}>
          <Plus /> Create
        </Button>
      </header>

      <AdminNews news={news} />
    </div>
  );
};

export default AdminNewsPage;
