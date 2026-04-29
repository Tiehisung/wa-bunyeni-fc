"use client";

import { DisplayFixtures } from "./DisplayFixtures";
import Header from "../../../components/Element";
import { QuickLinks } from "@/components/QuickLinks/LinkOrSectionId";
import { Separator } from "@/components/ui/separator";
import { IQueryResponse } from "@/types";
import { IMatch } from "@/types/match.interface";
import DataErrorAlert from "@/components/error/DataError";
import TableLoader from "@/components/loaders/Table";
import { useGetMatchesQuery } from "@/services/match.endpoints";

export default function AdminFixtures() {
  const { data: fixtures, isLoading, error } = useGetMatchesQuery({});

  if (isLoading) {
    return (
      <section className="">
        <Header title="FIXTURES & SCORES" subtitle="Manage Fixtures" />
        <TableLoader cols={2} rows={2} className="h-44" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="">
        <Header title="FIXTURES & SCORES" subtitle="Manage Fixtures" />
        <DataErrorAlert message={error} />
      </section>
    );
  }

  return (
    <section className="">
      <Header title="FIXTURES & SCORES" subtitle="Manage Fixtures" />
      <main className="_page pb-6 pt-10">
        <DisplayFixtures fixtures={fixtures as IQueryResponse<IMatch[]>} />

        <Separator />

        <h2 className="mt-8 mb-4">Quick Links</h2>

        <QuickLinks
          links={[
            {
              title: "Match Request",
              href: "/admin/matches/request",
              description: "Generate match request letter",
            },
            {
              title: "Create Fixture",
              href: "/admin/matches/create-fixture",
              description: "Add new match fixture",
            },
          ]}
          className="my-5"
        />
      </main>
    </section>
  );
}
