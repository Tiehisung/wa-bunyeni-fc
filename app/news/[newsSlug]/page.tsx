import OtherNews from "./OtherNews";
import { SearchAndFilterNews } from "./SearchAndFilter";
import NewsItemClient from "./NewsClient";
import { IPageProps } from "@/types";
import { INewsProps } from "@/types/news.interface";
import { getNewsItem } from "../page";
import { Metadata } from "next";
import { ENV } from "@/lib/env";

export async function generateMetadata({
  params,
}: IPageProps): Promise<Metadata> {
  const slug = (await params).newsId as string;
  const article: INewsProps = await getNewsItem(slug);

  if (!article) {
    return {
      title: "News | Konjiehi FC",
      description: "Latest updates from Konjiehi FC",
    };
  }

  const title = `Konjiehi FC - ${article?.headline?.text} | Konjiehi FC`;
  const description =
    article?.details?.find((d) => d.text)?.text ||
    "Read the latest news and updates from Konjiehi FC.";

  const image = article?.headline?.image || ENV.LOGO_URL;
  const url = `${ENV.APP_URL}/news/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: ENV.TEAM_NAME,
      images: [
        {
          url: image as string,
          width: 1200,
          height: 630,
          alt: article?.headline?.text,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image as string],
    },
  };
}
export default function NewsItemPage() {
  return (
    <div className="flex max-lg:flex-wrap items-start gap-6 relative pt-6 md:pl-10">
      <section className="grow min-w-3/4">
        <NewsItemClient />
      </section>
      <section className="sticky top-0 pt-4">
        <SearchAndFilterNews />
        <br />
        <OtherNews />
      </section>
    </div>
  );
}
