'use client'

import { INewsProps } from "@/types/news.interface";
import { Pagination } from "@/components/pagination/Pagination";
import { PrimarySearch } from "@/components/Search";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/timeAndDate";
import { IQueryResponse } from "@/types";
 
import { FC } from "react";
import NewsFilter from "./Filters";
import { PrimaryDropdown } from "@/components/Dropdown";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

const AdminNews: FC<{ news?: IQueryResponse<INewsProps[]> }> = ({ news }) => {
  return (
    <div className="my-24 px-4 ">
      <h1 className=" text-xl font-semibold mb-4 ">News📰</h1>
      <header className="flex items-center gap-2.5 my-6">
        <PrimarySearch
          className="w-fit"
          inputStyles="h-9"
          searchKey="news_search"
          type="search"
          placeholder="Search News"
        />

        <PrimaryDropdown
          trigger={<SlidersHorizontal />}
          variant={"secondary"}
      
          triggerStyles="rounded"
        >
          <NewsFilter />
        </PrimaryDropdown>
      </header>
      <ul className="grid md:grid-cols-2 gap-3 xl:grid-cols-3">
        {news?.data?.map((item) => {
          return (
            <li
              key={item._id}
              className="p-2 rounded border _borderColor flex relative"
            >
              <Link
                href={`/admin/news/${item.slug ?? item._id}`}
                className="w-full"
              >
                <img
                  src={item?.headline?.image}
                  className="w-full h-60 object-cover aspect-video"
                  alt={item.headline.text}
                />
                <p className="overflow-hidden text-wrap line-clamp-2">
                  {item.headline.text}
                </p>
                <div className="font-light text-sm">
                  <p>{formatDate(item?.createdAt, "March 2, 2025")}</p>
                  <p>{item?.reporter?.name}</p>
                </div>
              </Link>

              <div className="absolute">
                {!item?.isPublished && (
                  <Badge className="rounded-l-none text-sm">Unpublished</Badge>
                )}
              </div>
            </li>
          );
        })}
        {news?.data?.length === 0 && (
          <li className="_label py-6 text-2xl">No news items found</li>
        )}
      </ul>

      <div>
        <Pagination pagination={news?.pagination} />
      </div>
    </div>
  );
};

export default AdminNews;
