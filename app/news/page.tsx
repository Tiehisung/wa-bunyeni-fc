import { apiConfig } from "@/lib/configs";
import { LatestNews } from "./Latest";
import YouMayLike from "./YouMayLike";


export const getNewsItem = async (slug: string) => {
  try {
    const response = await fetch(`${apiConfig.news}/${slug}`, {
      cache: "no-store",
    });
    const news = await response.json();
    return news;
  } catch {
    return null;
  }
};

const NewsPage = () => {
  return (
    <>
      {/* <PageSEO page="news" /> */}
      <main className="container ">
        <section className="space-y-10">
          <LatestNews />

          <YouMayLike />
        </section>
      </main>
    </>
  );
};

export default NewsPage;
