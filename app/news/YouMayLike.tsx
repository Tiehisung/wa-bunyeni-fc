 'use client'
 
import { RxVideo } from "react-icons/rx";
import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import { useGetNewsQuery } from "@/services/news.endpoints";
import Loader from "@/components/loaders/Loader";
import { H } from "@/components/Element";
import DataErrorAlert from "@/components/error/DataError";
import Link from "next/link";

const YouMayLike = () => {
  const { data: newsData, isLoading, error } = useGetNewsQuery("");
  const news = newsData;

  if (isLoading) {
    return <Loader />;
  }

  if (error || !news?.data?.length) {
    return <DataErrorAlert message={error} />;
  }

  return (
    <div>
      <H>YOU MAY LIKE</H>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 gap-y-10 mt-5">
        {news?.data?.slice(0, 6)?.map((item, index) => (
          <AnimateOnView key={item._id} index={index}>
            <Link href={`/news/${item?.slug}`}>
              <div className="w-full overflow-hidden group relative">
                <img
                  src={item?.headline?.image as string}
                  alt={item?.headline.text}
                  className="aspect-4/2 w-full bg-secondary object-cover group-hover:opacity-85 xl:aspect-5/3 group-hover:scale-105 _slowTrans"
                />

                <div>
                  <p className="_p line-clamp-3">{item?.headline?.text}</p>
                </div>
                {item?.headline?.hasVideo && (
                  <RxVideo className="absolute bottom-1 right-1.5 text-primaryRed text-2xl" />
                )}
              </div>
            </Link>
          </AnimateOnView>
        ))}
      </div>
    </div>
  );
};

export default YouMayLike;
