
'use client'

import OtherAdminNews from "./OtherNews";
import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./NewsClient";
import {
  useGetNewsItemQuery,
  useGetNewsQuery,
} from "@/services/news.endpoints";
import PageLoader from "@/components/loaders/Page";
import { useParams, useSearchParams } from "next/navigation";

export default function NewsItemPage() {
  const newsSlug = useParams().newsSlug;
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();

  const { data: newsItemData, isLoading: itemLoading } = useGetNewsItemQuery(
    newsSlug?.toString() || "",
  );

  const newsItem = newsItemData?.data;

  const { data: newsData, isLoading: newsLoading } =
    useGetNewsQuery(paramsString);

  const isLoading = itemLoading || newsLoading;

  const news = newsData;

 
  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <>
     

      <div className="flex max-lg:flex-wrap items-start gap-6 relative pt-6 md:pl-10">
        <section className="grow min-w-3/4">
          <NewsItemClient newsItem={newsItem} />
        </section>
        <section className="sticky top-0 pt-4">
          <SearchAndFilterNews />
          <br />
          <OtherAdminNews news={news} />
        </section>
      </div>
    </>
  );
}
