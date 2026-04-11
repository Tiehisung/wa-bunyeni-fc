import { FC, useState } from "react";

import { IFileProps } from "@/types/file.interface";
import { INewsProps } from "@/types/news.interface";
import { NewsReactions } from "./Reactions";
import MasonryGallery from "@/components/Gallery/Masonry";
import LightboxViewer from "@/components/viewer/LightBox";
import { AVATAR } from "@/components/ui/avatar";
import Divider from "@/components/Divider";

const NewsItemClient: FC<{ newsItem?: INewsProps }> = ({ newsItem }) => {
  const [open, setOpen] = useState(false);
  const [gallery, setGallery] = useState<IFileProps[]>([]);

  return (
    <div className=" mb-10">
      <header className="flex flex-wrap items-center gap-2.5">
        <img
          width={1000}
          height={500}
          alt={newsItem?.headline?.text}
          src={newsItem?.headline?.image as string}
          className={`w-full min-w-60 h-auto bg-cover object-cover aspect-5/3  `}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: newsItem?.headline?.text as string,
          }}
          className="text-lg md:text-lg mb-5 font-bold _title"
        />
      </header>

      <div className=" mt-15 gap-x-6">
        <main className=" grow my-6">
          <ul>
            {newsItem?.details?.map((detail, index) => {
              return (
                <li key={index} className="space-y-3.5 mb-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detail?.text as string,
                    }}
                    className="_p"
                  />

                  {/* Large first media */}
                  {(detail?.media?.length ?? 0) > 0 && (
                    <div key={index} className="flex flex-wrap gap-4">
                      <img
                        width={1000}
                        height={500}
                        alt={detail?.media?.[0]?.original_filename as string}
                        src={
                          detail?.media?.[0].resource_type == "image"
                            ? detail?.media?.[0].secure_url
                            : (detail?.media?.[0].thumbnail_url as string)
                        }
                        className={`w-full min-w-60 h-auto bg-cover object-cover aspect-5/3 `}
                        onClick={() => {
                          setOpen(true);
                          setGallery((detail?.media ?? []) as IFileProps[]);
                        }}
                      />
                    </div>
                  )}

                  {/* Grid of other media */}
                  {(detail?.media?.length ?? 0) > 1 && (
                    <MasonryGallery
                      files={(detail?.media as IFileProps[]) ?? []}
                      // useSize
                      wrapperStyles="max-sm:columns-2 md:columns-2 lg:columns-2 xl:columns-3"
                      className="rounded-none "
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Comments and reactions */}
          <section className=" mt-32 border-t-2 pt-4">
            <NewsReactions newsItem={newsItem as INewsProps} />
          </section>

          <section className=" my-6 pt-6">
            <Divider
              content={
                <div className="flex flex-col justify-center items-center gap-3">
                  <AVATAR
                    src={newsItem?.reporter?.avatar as string}
                    alt="reporter"
                    className="h-16 w-16"
                    border
                  />

                  <div className="space-y-2.5">
                    <h1 className="font-bold">{newsItem?.reporter?.name}</h1>
                    <h1>{newsItem?.reporter?.about ?? "KonjiehiFC Staff"}</h1>
                  </div>
                </div>
              }
            />
          </section>
        </main>
      </div>

      <LightboxViewer
        open={open}
        onClose={() => setOpen(false)}
        files={gallery.map((f) => ({
          ...f,
          src: f.secure_url,
          alt: f.original_filename,
          type: f.resource_type == "image" ? "image" : "video",
        }))}
        index={0}
      />
    </div>
  );
};

export default NewsItemClient;
