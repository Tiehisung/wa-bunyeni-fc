import { LatestNews } from "./Latest";
import YouMayLike from "./YouMayLike";
import { Metadata } from "next";
import { ENV } from "@/lib/env";
import { IQueryResponse } from "@/types";
import { INewsProps } from "@/types/news.interface";
import {   baseApiUrl } from "@/lib/configs";

export const getNews = async (query?: string) => {
  try {
    const uri = query ? `${`${baseApiUrl}/news`}${query}` : `${baseApiUrl}/news`;

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
  const description =
    article?.details?.find((d) => d.text)?.text?.substring(0, 200) ||
    `Latest news, updates, and announcements from ${ENV.TEAM_NAME}. Match reports, injury updates, and exclusive club content. Stay informed with breaking news.`;

  const image = article?.headline?.image || ENV.LOGO_URL;
  const url = `${ENV.APP_URL}/news/${article?.slug}`;
  const publishedDate = article?.createdAt || article?.updatedAt;

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

      <YouMayLike />
    </main>
  );
};

export default NewsPage;

// export const metadata: Metadata = {
//     title: `News | ${ENV.TEAM_NAME}`,
//     description: `Latest news, updates, and announcements from ${ENV.TEAM_NAME}. Transfer news, match reports, injury updates, and exclusive club content. Stay informed with breaking news.`,
//     keywords: [`${ENV.TEAM_NAME} news`, 'football news', 'club updates', 'transfer news', 'match reports'],
//     openGraph: {
//         title: `News | ${ENV.TEAM_NAME}`,
//         description: `Latest news and updates from ${ENV.TEAM_NAME}. Breaking stories, match reports, and exclusive content.`,
//         url: `${ENV.APP_URL}/news`,
//         siteName: ENV.TEAM_NAME,
//         type: 'website',
//         images: [
//             {
//                 url: ENV.LOGO_URL,
//                 width: 1200,
//                 height: 630,
//                 alt: `${ENV.TEAM_NAME} News`,
//             },
//         ],
//     },
//     twitter: {
//         card: 'summary_large_image',
//         title: `News | ${ENV.TEAM_NAME}`,
//         description: `Latest news and updates from ${ENV.TEAM_NAME}.`,
//         images: [ENV.LOGO_URL],
//     },
//     alternates: {
//         canonical: `${ENV.APP_URL}/news`,
//     },
// };
