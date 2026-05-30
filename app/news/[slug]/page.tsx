import OtherNews from "./RelatedNews";
import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./NewsClient";
import { INewsProps } from "@/types/news.interface";
import { Metadata } from "next";
import { ENV } from "@/lib/env";
import { shortText } from "@/lib";
import { IPageProps, IQueryResponse } from "@/types";
import { baseApiUrl } from "@/lib/configs";
import { stripHTML } from "@/lib/dom";

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
  const { slug } = await params;
  const articleData: IQueryResponse<INewsProps> = await getNewsItem(
    slug as string,
  );

  const article = articleData?.data;

  if (!article) {
    return {
      title: `${ENV.TEAM_NAME} News`,
      description: `Latest news and updates from ${ENV.TEAM_NAME}`,
    };
  }

  const title = `${ENV.TEAM_NAME} - ${article?.headline?.text}`;
  const description = shortText(
    stripHTML(article?.details?.find((d) => d?.text)?.text as string),
    120,
  ) as string;

  const image = article?.headline?.image || ENV.LOGO_URL;
  const url = `${ENV.APP_URL}/news/${slug}`;
  const publishedDate = article?.createdAt || article?.updatedAt;

  const otherImages =
    article?.details
      ?.filter((d) => d.media?.find((m) => m?.resource_type == "image"))
      ?.slice(0, 2)
      .map((detail) => detail.media?.find((m) => m?.resource_type == "image"))
      ?.slice(0, 2)
      ?.map((m) => ({
        url: m?.secure_url as string,
        width: 1200,
        height: 630,
        alt: article?.headline?.text,
      })) || [];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: ENV.TEAM_NAME,
      type: "article",
      publishedTime: publishedDate,
      authors: [
        article?.createdBy?.name || ENV.TEAM_NAME,
        (article?.createdBy?.name as string) || "",
      ] as string[],
      images: [
        {
          url: image as string,
          width: 1200,
          height: 630,
          alt: article?.headline?.text,
        },
        ...otherImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image as string],
    },
    keywords: article?.tags || [`${ENV.TEAM_NAME}`, "news", "football"],
    alternates: {
      canonical: url,
    },
  };
}

export default async function NewsItemPage() {
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
