"use client";

import { FC } from "react";
import FileRenderer from "@/components/files/FileRender";
import { IFileProps } from "@/types/file.interface";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
import { shortText } from "@/lib";

import { INewsProps } from "@/types/news.interface";
import {
  useDeleteNewsMutation,
  useUpdateNewsMutation,
} from "@/services/news.endpoints";

import { smartToast } from "@/utils/toast";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

const NewsItemClient: FC<{ newsItem: INewsProps }> = ({ newsItem }) => {
  const router = useRouter();
  const [deleteNews] = useDeleteNewsMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();

  const handlePublishToggle = async (publishState: boolean) => {
    try {
      const result = await updateNews({
        _id: newsItem._id,
        isPublished: publishState,
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteNews(newsItem._id).unwrap();
      if (result.success) router.push("/admin/news");

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div className="mb-10 p-4">
      <header className="flex flex-wrap items-center gap-2.5">
        <Image
          width={230}
          height={320}
          alt={newsItem?.headline?.text}
          src={newsItem?.headline?.image as string}
          className="w-full min-w-64 h-auto bg-cover object-cover aspect-5/3"
        />
        <div
          dangerouslySetInnerHTML={{
            __html: newsItem?.headline?.text as string,
          }}
          className="text-lg md:text-lg mb-5 font-bold _title"
        />
      </header>

      <div className="grid lg:flex items-start mt-15 gap-x-6">
        <main className="_p grow my-6">
          <ul>
            {newsItem?.details?.map((detail, index) => {
              return (
                <li key={index} className="space-y-3.5 mb-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detail?.text as string,
                    }}
                  />

                  <div className="flex flex-wrap gap-4">
                    {detail?.media?.map((file, i) => {
                      if (file.secure_url)
                        return (
                          <FileRenderer file={file as IFileProps} key={i} />
                        );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Comments and reactions */}
          <section className="mt-32 border-t-2">
            <h1 className="_title text-muted-foreground">ACTIONS</h1>

            <div className="flex items-center gap-5 flex-wrap p-4 py-8 border-y">
              <Link
                href={`/admin/news/edit?newsSlug=${newsItem?.slug || newsItem?._id}`}
                className="_primaryBtn"
              >
                Edit
              </Link>

              {newsItem?.isPublished ? (
                <ConfirmActionButton
                  primaryText="Unpublish"
                  trigger={"Unpublish"}
                  onConfirm={() => handlePublishToggle(false)}
                  variant="destructive"
                  title="Unpublish News"
                  confirmText={`Are you sure you want to unpublish "<b>${shortText(
                    newsItem?.headline.text,
                    40,
                  )}</b>"?`}
                  isLoading={isUpdating}
                />
              ) : (
                <ConfirmActionButton
                  primaryText="Publish"
                  trigger={"Publish"}
                  variant={"outline"}
                  onConfirm={() => handlePublishToggle(true)}
                  title="Publish News to public"
                  confirmText={`Confirm to publish "<b>${shortText(
                    newsItem?.headline.text,
                    40,
                  )}</b>"`}
                  isLoading={isUpdating}
                  escapeOnEnd
                />
              )}

              <ConfirmActionButton
                trigger={"Delete"}
                primaryText="Delete News"
                onConfirm={handleDelete}
                variant="destructive"
                title="Delete News"
                confirmText={`Are you sure you want to delete "<b>${shortText(
                  newsItem?.headline.text,
                  40,
                )}</b>"?`}
                escapeOnEnd
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default NewsItemClient;
