import { LatestNews } from "./Latest";

import { Metadata } from "next";
import { ENV } from "@/lib/env";
import { IQueryResponse } from "@/types";
import { INewsProps } from "@/types/news.interface";
import { baseApiUrl } from "@/lib/configs";
import { shortText } from "@/lib";

export const getNews = async (query?: string) => {
  try {
    const uri = query ? `${baseApiUrl}/news${query}` : `${baseApiUrl}/news`;

    const response = await fetch(uri, { cache: "no-cache" });
    return await response.json();
  } catch {
    return null;
  }
};
export const getLatestNews = async (query?: string) => {
  try {
    const uri = query
      ? `${baseApiUrl}/news/latest${query}`
      : `${baseApiUrl}/news/latest`;

    const response = await fetch(uri, { cache: "no-cache" });
    return await response.json();
  } catch {
    return null;
  }
};
export const getTrendingNews = async (query?: string) => {
  try {
    const uri = query
      ? `${baseApiUrl}/news/trending${query}`
      : `${baseApiUrl}/news/trending`;

    const response = await fetch(uri, { cache: "no-cache" });
    return await response.json();
  } catch {
    return null;
  }
};
export const getRelatedNews = async (newsId: string, query?: string) => {
  try {
    const uri = query
      ? `${baseApiUrl}/news/${newsId}/related${query}`
      : `${baseApiUrl}/news/${newsId}/related`;

    const response = await fetch(uri, { cache: "no-cache" });
    return await response.json();
  } catch {
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const articleData: IQueryResponse<INewsProps[]> = await getNews("?limit=1");

  const article = articleData?.data?.[0];

  if (!article) {
    return {
      title: `${ENV.TEAM_NAME} News`,
      description: `Latest news and updates from ${ENV.TEAM_NAME}`,
    };
  }

  const title = `News | ${ENV.TEAM_NAME}`;
  const description = shortText(
    article?.details?.find((d) => d.text)?.text as string,
    120,
  );

  const image = article?.headline?.image || ENV.LOGO_URL;
  const url = `${ENV.APP_URL}/news/${article?.slug}`;
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

const NewsPage = () => {
  return (
    <main className="container space-y-10">
      <LatestNews />
    </main>
  );
};

export default NewsPage;
