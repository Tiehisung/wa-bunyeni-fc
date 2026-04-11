'use client'

import { markupToPlainText } from "@/lib/dom";
import NewsCard from "./NewsCard";
import { useGetNewsQuery } from "@/services/news.endpoints";
import { H } from "@/components/Element";
import PageLoader from "@/components/loaders/Page";
import DataErrorAlert from "@/components/error/DataError";

export function LatestNews() {
  const { data: newsData, isLoading, error } = useGetNewsQuery("");
  const news = newsData;

  if (isLoading) {
    return (
      <div>
        <H>LATEST NEWS</H>
        <PageLoader />
      </div>
    );
  }

  if (error || !news?.data?.length) {
    return (
      <div>
        <H>LATEST NEWS</H>
        <DataErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div>
      <H>LATEST NEWS</H>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6 ">
        {news?.data?.slice(0, 5)?.map((item) => (
          <NewsCard
            key={item?._id}
            id={item?.slug}
            title={item?.headline?.text}
            summary={markupToPlainText(
              item?.details?.find((d) => d.text)?.text as string,
            )}
            image={item?.headline?.image}
            date={item?.createdAt}
            tags={item?.tags}
            reactions={[
              item?.likes?.length ?? 0,
              item?.comments?.length ?? 0,
              item?.shares?.length ?? 0,
              item?.views?.length ?? 0,
            ].reduce((acc, p) => acc + p, 0)}
          />
        ))}
      </section>
    </div>
  );
}
