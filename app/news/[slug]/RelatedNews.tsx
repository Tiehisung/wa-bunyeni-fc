"use client";

import { RxVideo } from "react-icons/rx";
import TableLoader from "@/components/loaders/Table";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useGetRelatedNewsQuery } from "@/services/news.endpoints";
import Image from "next/image";

export default function RelatedNews({ newsSlug }: { newsSlug?: string }) {
  const slug = useParams().slug?.toString() || newsSlug || "";
  const { data: relatedNews, isLoading } = useGetRelatedNewsQuery({
    slug,
  });

  const isAdmin = usePathname().includes("/admin");

  if (isLoading)
    return <TableLoader cols={1} rows={3} className="h-32 w-full" />;
  return (
    <div className="grid gap-5 gap-y-10 mt-5 sticky top-0">
      {relatedNews?.data?.map((item, index) => (
        <Link
          href={`${isAdmin ? "/admin" : ""}/news/${item?.slug || item?._id}`}
          key={index}
        >
          <div className="w-full overflow-hidden group relative">
            <Image
              src={item?.headline?.image as string}
              width={400}
              height={500}
              alt={item?.headline?.text as string}
              className="aspect-4/2 w-full bg-secondary object-cover group-hover:opacity-85 xl:aspect-5/3 group-hover:scale-105 "
            />

            <div>
              <p className="_p line-clamp-3">{item?.headline?.text}</p>
            </div>
            {item?.headline?.hasVideo && (
              <RxVideo className="absolute bottom-1 right-1.5 text-primaryRed text-2xl" />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
