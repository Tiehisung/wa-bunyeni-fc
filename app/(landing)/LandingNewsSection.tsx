"use client";

import React from "react";
import { ArrowRight, ChevronRight, TrendingUpIcon } from "lucide-react";

import { INewsItem, INewsProps, INewsSection } from "@/types/news.interface";
import { useGetNewsQuery } from "@/services/news.endpoints";

import Link from "next/link";
import PageLoader from "@/components/loaders/Page";
import Image from "next/image";

// Main News Section Props Interface
export interface INewsSectionProps extends INewsSection {
  className?: string;

  onItemClick?: (item: INewsItem) => void;

  onSeeMoreClick?: () => void;

  seeMoreText?: string;

  isLoading?: boolean;

  error?: string | null;

  /** Custom header element */
  header?: React.ReactNode;

  /** Custom footer element */
  footer?: React.ReactNode;

  /** Number of items to show (default: all) */
  itemsToShow?: number;

  /** Grid columns on desktop (default: 3) */
  desktopColumns?: 1 | 2 | 3 | 4;

  /** Enable lazy loading for images */
  lazyLoadImages?: boolean;

  /** Image placeholder while loading */
  imagePlaceholder?: string;

  /** Additional data attributes for testing */
  dataTestId?: string;
}

interface Props {
  newsItems?: INewsProps[];
}
// Large Screen Component (Desktop)
const Desktop: React.FC<Props> = ({ newsItems }) => {
  const main = newsItems?.[0];
  const subs = newsItems?.slice(1, 4);
  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden">
      {/* Trending Header */}
      <div className="flex items-center gap-2 my-6">
        <span className=" font-semibold text-3xl tracking-wide">
      TRENDING 
        </span>
      </div>

      {/* Hero Section with Main Image */}
      <Link href={`/news/${main?.slug}`}>
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <Image
            width={400}
            height={400}
            src={main?.headline?.image as string}
            alt="International break action"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
              {main?.headline?.text}
            </h2>
            {/* <div
              className="text-white text-sm line-clamp-2 "
              dangerouslySetInnerHTML={{
                __html: main?.details?.[0]?.text as string,
              }}
            /> */}
          </div>
        </div>
      </Link>

      {/* Trending Items Grid */}
      <div className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subs?.map((item) => (
            <Link href={`/news/${item?.slug}`} key={item._id}>
              <div className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    width={200}
                    height={200}
                    src={item?.headline?.image}
                    alt={item?.headline?.text}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                    {"category"}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary transition-colors duration-300 shrink-0">
                      <TrendingUpIcon className="w-5 h-5  group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-3 min-h-20">
                        {item?.headline?.text}
                      </h3>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* See More Link */}
        <div className="flex justify-end border-t pt-6 mt-4">
          <Link
            href={"/news"}
            className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
          >
            <span> {"TRENDING"} - SEE MORE</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Mobile Screen Component
const Mobile: React.FC<Props> = ({ newsItems }) => {
  const main = newsItems?.[0];
  const subs = newsItems?.slice(1, 4);
  return (
    <div className="w-full overflow-hidden">
      {/* Trending Header - Compact */}
      <div className=" my-5 flex items-center gap-2">
        <span className=" font-semibold text-3xl tracking-wide">
          {"TRENDING"}
        </span>
      </div>

      {/* Hero Section with Main Image - Mobile */}
      <Link href={`/news/${main?.slug}`}>
        <div className="relative max-sm:h-[80vw] overflow-hidden">
          <Image
            width={400}
            height={400}
            src={main?.headline?.image as string}
            alt="International break action"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-lg font-bold text-white mb-1 leading-tight">
              {main?.headline?.text}
            </h2>

            {/* <div
              className="text-white/80 text-xs line-clamp-2 "
              dangerouslySetInnerHTML={{
                __html: main?.details?.[0]?.text as string,
              }}
            /> */}
          </div>
        </div>
      </Link>

      {/* Trending Items List - Mobile with Images */}
      <div className="my-5">
        <div className="space-y-4 mb-5">
          {subs?.map((item) => (
            <div
              key={item?._id}
              className="bg-card overflow-hidden transition-colors cursor-pointer"
            >
              <div className="flex">
                <div className="w-24 h-24 shrink-0">
                  <Image
                    width={200}
                    height={200}
                    src={item?.headline?.image}
                    alt={item?.headline?.text}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-card p-1.5 rounded-lg shrink-0">
                      <TrendingUpIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                        {item.headline?.text}
                      </h3>
                      <Link
                        href={`/news/${item?.slug}`}
                        className="flex items-center gap-1 text-primary text-xs font-medium mt-2"
                      >
                        <span>Read more</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link - Compact */}
        <div className="border-t pt-4">
          <Link
            href={"/news"}
            className="flex items-center justify-between w-full text-primary font-semibold text-sm"
          >
            <span> {"TRENDING"} - SEE MORE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Responsive Component
interface TrendingProps {
  className?: string;
  // data: INewsSectionProps;
}

const NEWSSECTION: React.FC<TrendingProps> = ({ className = "" }) => {
  const { data: newsData, isLoading } = useGetNewsQuery("");

 

  if (isLoading) {
    return (
      <div className=" space-y-8 flex justify-center items-center ">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="hidden md:block">
        <Desktop newsItems={newsData?.data} />
      </div>

      <div className="block md:hidden">
        <Mobile newsItems={newsData?.data} />
      </div>
    </div>
  );
};

export default NEWSSECTION;
