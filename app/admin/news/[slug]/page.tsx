"use client";

import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./ClientItem";
import { useGetNewsItemQuery } from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { useParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";
import RelatedNews from "@/app/news/[slug]/RelatedNews";

export default function NewsItemPage() {
  const slug = useParams().slug;

  const {
    data: newsItemData,
    isLoading,
    error: itemError,
  } = useGetNewsItemQuery(slug?.toString() || "");

  const newsItem = newsItemData?.data;

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
        <RelatedNews />
      </section>
    </div>
  );
}
