"use client";

import FixturesSection from "./Fixtures";
import HEADER from "@/components/Element";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import DataErrorAlert from "@/components/error/DataError";
import { getErrorMessage } from "@/lib/error";
import TableLoader from "@/components/loaders/Table";
// import { PageSEO } from "@/utils/PageSEO";

export default function MatchesPage() {
  const { data: fixtures, isLoading, error } = useGetMatchesQuery({});

  if (isLoading) {
    return (
      <div>
        <HEADER title="Scores & Fixtures" />
        <TableLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HEADER title="Scores & Fixtures" />
        <DataErrorAlert message={getErrorMessage(error)} />
      </div>
    );
  }

  return (
    <div className="">
      {/* <PageSEO page="matches" /> */}

      <HEADER title="Scores & Fixtures" />
      <section className="pb-6  ">
        <FixturesSection fixtures={fixtures} />
      </section>
    </div>
  );
}
