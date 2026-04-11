"use client";

import { FC, useEffect } from "react";
import Header from "../../../../components/Element";

import Loader from "@/components/loaders/Loader";
 
import { useGetNewsItemQuery } from "@/services/news.endpoints";
import { useAppDispatch } from "@/store/hooks/store";
import { setNews } from "@/store/slices/news.slice";
import { IPostNews } from "../NewsForm";
import { EditNewsForm } from "./EditNewsForm";
import { useSearchParams } from "next/navigation";
import DataErrorAlert from "@/components/error/DataError";

const NewsEditingPage: FC = () => {
  const searchParams = useSearchParams();

  // Get specific parameter
  const newsSlug = searchParams.get("newsSlug");

  const {
    data: newsItem,
    isLoading,
    error,
  } = useGetNewsItemQuery(newsSlug || "");

  if (isLoading) {
    return (
      <div>
        <Header title="Editing news" subtitle="" />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading news item..." />
        </div>
      </div>
    );
  }

  if (error || !newsItem?.data) {
    return <DataErrorAlert message={error} />;
  }

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (newsItem) dispatch(setNews(newsItem?.data as IPostNews));
  }, [newsItem, dispatch]);

  return (
    <div>
      <Header title="Editing news" subtitle="" />
      <EditNewsForm newsItem={newsItem?.data} />
    </div>
  );
};

export default NewsEditingPage;
