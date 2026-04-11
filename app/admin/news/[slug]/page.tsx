"use client";

import OtherAdminNews from "./OtherNews";
import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./ClientItem";
 import {
  useGetNewsItemQuery,
  useGetNewsQuery,
} from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams, useSearchParams } from "next/navigation";

export default function NewsItemPage() {
  const slug = useParams().slug;
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: newsItemData,
    isLoading: itemLoading,
    error: itemError,
  } = useGetNewsItemQuery(slug?.toString() || "");

  const { data: newsData, isLoading: newsLoading } =
    useGetNewsQuery(paramsString);

  const isLoading = itemLoading || newsLoading;
  const newsItem = newsItemData?.data;
  const news = newsData;

  if (isLoading) {
    return (
      <div className="flex max-lg:flex-wrap items-start gap-4 relative min-h-100 justify-center">
        <Loader message="Loading news item..." />
      </div>
    );
  }

  if (itemError || !newsItem) {
    return (
      <div className="flex max-lg:flex-wrap items-start gap-4 relative">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load news item:{" "}
            {(itemError as any)?.message || "News item not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex max-lg:flex-wrap items-start gap-4 relative">
      <section className="grow min-w-3/4">
        <NewsItemClient newsItem={newsItem} />
      </section>
      <section className="sticky top-0 pt-4">
        <SearchAndFilterNews />
        <br />
        <OtherAdminNews news={news} />
      </section>
    </div>
  );
}
// {
//             page?: number;
//             limit?: number;
//             category?: string;
//             search?: string;
//             sortBy?: string;
//             status?: 'published' | 'draft' | 'archived';
//         }
