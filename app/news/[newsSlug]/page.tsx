import OtherNews from "./OtherNews";
import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./NewsClient";

import { INewsProps } from "@/types/news.interface";
 
import { Metadata } from "next";
import { ENV } from "@/lib/env";
import { IPageProps, IQueryResponse } from "@/types";
import {   baseApiUrl } from "@/lib/configs";


export const getNewsItem = async (slug: string) => {
  try {
    const response = await fetch(`${baseApiUrl}/news/${slug}`, {
      cache: "no-store",
    });
    const news = await response.json();
    return news;
  } catch {
    return null;
  }
};


export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata> {
  const { newsSlug: slug } = await params;
  const articleData: IQueryResponse<INewsProps> = await getNewsItem(slug as string);

  const article = articleData?.data;

  if (!article) {
    return {
      title: `${ENV.TEAM_NAME} News`,
      description: `Latest news and updates from ${ENV.TEAM_NAME}`,
    };
  }

  const title = `${ENV.TEAM_NAME} - ${article?.headline?.text}`;
  // const description =
  //   article?.details?.find((d) => d.text)?.text?.substring(0, 200) ||
  //   `Read the latest news and updates from ${ENV.TEAM_NAME}.`;

  const image = article?.headline?.image || ENV.LOGO_URL;
  const url = `${ENV.APP_URL}/news/${slug}`;
  const publishedDate = article?.createdAt || article?.updatedAt;

  return {
    title,
    // description,
    openGraph: {
      title,
      // description,
      url,
      siteName: ENV.TEAM_NAME,
      type: "article",
      publishedTime: publishedDate,
      authors: [
        article?.reporter?.name || ENV.TEAM_NAME,
        (article?.createdBy?.name as string) || "",
      ] as string[],
      images: [
        {
          url: image as string,
          width: 1200,
          height: 630,
          alt: article?.headline?.text,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      // description,
      images: [image as string],
    },
    keywords: article?.tags || [`${ENV.TEAM_NAME}`, "news", "football"],
    alternates: {
      canonical: url,
    },
  };
}
// export async function generateMetadata({
//   params,
// }: IPageProps): Promise<Metadata> {
//   const slug = (await params).newsId as string;
//   const article: INewsProps = await getNewsItem(slug);

//   if (!article) {
//     return {
//       title: "News | Konjiehi FC",
//       description: "Latest updates from Konjiehi FC",
//     };
//   }

//   const title = `Konjiehi FC - ${article?.headline?.text} | Konjiehi FC`;
//   const description =
//     article?.details?.find((d) => d.text)?.text ||
//     "Read the latest news and updates from Konjiehi FC.";

//   const image = article?.headline?.image || kfc.logo;
//   const url = `${kfc.url}/news/${slug}`;

//   const ogImage = image.replace(
//     "/upload/",
//     "/upload/c_fill,w_1200,h_630,f_auto,q_auto/"
//   );

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       url,
//       siteName: kfc.name,
//       images: [
//         {
//           url: ogImage,
//           width: 1200,
//           height: 630,
//           alt: article?.headline?.text,
//         },
//       ],
//       type: "article",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: [image],
//     },
//   };
// }

export default function NewsItemPage() {
  return (
    <article className="flex max-lg:flex-wrap items-start gap-6 relative pt-6 md:pl-10">
      <section className="grow min-w-3/4">
        <NewsItemClient />
      </section>
      <section className="sticky top-0 pt-4">
        <SearchAndFilterNews />
        <br />
        <OtherNews />
      </section>
    </article>
  );
}
