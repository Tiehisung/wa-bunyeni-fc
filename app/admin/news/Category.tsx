'use client'

import { stripHTML } from "@/lib/dom";
import { useGetLatestNewsQuery, useGetTrendingNewsQuery,  } from "@/services/news.endpoints";
import { H } from "@/components/Element";
import PageLoader from "@/components/loaders/Page";
import DataErrorAlert from "@/components/error/DataError";
import { sParamsToObject } from "@/lib/searchParams";
import NewsCard from "@/app/news/NewsCard";

interface IProps{
  category:'latest'|'trending'
  
}

export function CategoryNews({category}:IProps) {  
  const params = sParamsToObject();

  const { data: latest, isLoading:loadingLatest,  } = useGetLatestNewsQuery({...params},{skip:category!=='latest'});
  const { data: trending, isLoading: loadingTrending } =
    useGetTrendingNewsQuery({ ...params }, { skip: category !== "trending" });
  const news = category=='latest'?latest:trending;
  const isLoading=loadingLatest||loadingTrending

  if (isLoading) {
    return (
      <div>
        <H>CATEGORY NEWS</H>
        <PageLoader />
      </div>
    );
  }

  if (!isLoading && !news?.data) {
    return (
      <div>
        <H>CATEGORY NEWS</H>
        <DataErrorAlert message={`Failed to fetch ${category} news`} />
      </div>
    );
  }

  return (
    <div>
      <H>{category.toUpperCase()} NEWS</H>
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6 ">
        {news?.data?.slice(0, 5)?.map((item) => (
          <NewsCard
            key={item?._id}
            id={item?.slug}
            title={item?.headline?.text}
            summary={stripHTML(
              item?.details?.find((d) => d.text)?.text as string,
            )}
            image={item?.headline?.image}
            date={item?.createdAt}
            tags={item?.tags}
            reactions={[
              item?.stats?.likeCount ?? 0,
              item?.stats?.commentCount ?? 0,
              item?.stats?.shareCount ?? 0,
              item?.stats?.viewCount ?? 0,
            ].reduce((acc, p) => acc + p, 0)}
          />
        ))}
      </section>
    </div>
  );
}
