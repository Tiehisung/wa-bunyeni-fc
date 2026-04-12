"use client";

import { H } from "@/components/Element";
import { useGetNewsQuery } from "@/services/news.endpoints";
import NewsCard from "../news/NewsCard";
import { markupToPlainText } from "@/lib/dom";
import { ResponsiveSwiper } from "@/components/carousel/ResponsiveSwiper";
import DataErrorAlert from "@/components/error/DataError";
import { getErrorMessage } from "@/lib/error";
import CardLoader from "@/components/loaders/CardLoader";

const LandingNewsHeadlines = () => {
  const { data: newsData, isLoading, error } = useGetNewsQuery("");
  const news = newsData;
  if (isLoading) {
    return (
      <div className="">
        <H>NEWS </H>
        <div className="flex justify-center items-center min-h-50">
          <CardLoader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <H>NEWS </H>
        <DataErrorAlert message={getErrorMessage(error)} />
      </div>
    );
  }

  return (
    <div className=" max-w-6xl mx-auto">
      <H>NEWS </H>
      <ResponsiveSwiper
        swiperStyles={{ width: "100%", height: "fit-content" }}
        slideStyles={{ borderRadius: "0" }}
        slides={
          news?.data?.map((item) => (
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
          )) ?? []
        }
      />
    </div>
  );
};

export default LandingNewsHeadlines;
