import { LatestNews } from "./Latest";
import YouMayLike from "./YouMayLike";

// import { PageSEO } from "@/utils/PageSEO";

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
