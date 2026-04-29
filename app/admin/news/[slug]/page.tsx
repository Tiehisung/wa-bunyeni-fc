"use client";

import OtherAdminNews from "./OtherNews";
import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./ClientItem";
 import {
  useGetNewsItemQuery,
  useGetNewsQuery,
} from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { useParams, useSearchParams } from "next/navigation";
import { sParamsToObject } from "@/lib/searchParams";
import DataErrorAlert from "@/components/error/DataError";

export default function NewsItemPage() {
  const slug = useParams().slug;
  const  searchParams  = useSearchParams();
  const params = sParamsToObject(searchParams);

  const {
    data: newsItemData,
    isLoading: itemLoading,
    error: itemError,
  } = useGetNewsItemQuery(slug?.toString() || "");

  const { data: newsData, isLoading: newsLoading } = useGetNewsQuery({
    ...params,
  });

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
    return <DataErrorAlert message={itemError} />;
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
 