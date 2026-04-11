'use client'

import { INewsProps } from "@/types/news.interface";
import { AnimateOnView } from "@/components/Animate/AnimateOnView";
import { IQueryResponse } from "@/types";

import { RxVideo } from "react-icons/rx";
import TableLoader from "@/components/loaders/Table";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
 

export default function OtherAdminNews({
  news,
}: {
  news?: IQueryResponse<INewsProps[]>;
}) {
  const newsId = useParams().newsId;
  const others = news?.data?.filter((d) => d._id !== newsId);
  const isAdmin = usePathname().includes("/admin");
  return (
    <div className="grid gap-5 gap-y-10 mt-5 sticky top-0">
      {!news ? (
        <TableLoader cols={1} rows={3} className="h-32 w-full" />
      ) : (
        others?.map((item, index) => (
          <AnimateOnView key={item._id} index={index}>
            <Link
              href={`${isAdmin ? "/admin" : ""}/news/${item?.slug || item?._id}`}
            >
              <div className="w-full overflow-hidden group relative">
                <img
                  src={item?.headline?.image as string}
                  width={400}
                  height={500}
                  alt={item?.headline.text}
                  className="aspect-4/2 w-full bg-secondary object-cover group-hover:opacity-85 xl:aspect-5/3 group-hover:scale-105 _slowTrans "
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
        ))
      )}
    </div>
  );
}
