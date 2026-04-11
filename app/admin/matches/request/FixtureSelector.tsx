"use client";

import { Button } from "@/components/buttons/Button";
import { useUpdateSearchParams } from "@/hooks/params";
import { formatDate } from "@/lib/timeAndDate";
import { IQueryResponse } from "@/types";
import { IMatch } from "@/types/match.interface";
import Link from "next/link";
 
interface IProps {
  fixtures?: IQueryResponse<IMatch[]>;
}

const FixtureSelector = ({ fixtures }: IProps) => {
  const { setParam } = useUpdateSearchParams();
  if ((fixtures?.data?.length ?? 0) <= 0)
    return (
      <p className="font-normal">
        There are no available fixtures.{" "}
        <Link href={"/admin/matches/create-fixture"} className="_link">
          Kindly create a fixture to continue
        </Link>
      </p>
    );
  return (
    <div className=" py-6">
      <h1 className="text-Orange border p-4 uppercase my-4 text-center border-Orange">
        Select a match to continue
      </h1>

      <div className="flex flex-wrap gap-4">
        {fixtures?.data?.map((fixture) => (
          <Button
            key={fixture?._id}
            variant={"outline"}
            className="rounded-full px-6 text-wrap whitespace-break-spaces max-w-full line-clamp-2 h-fit"
            onClick={() => setParam("fixtureId", fixture?._id)}
          >
            {fixture?.title}
            {" - "}
            <span className="text-xs font-light">
              {formatDate(fixture?.date, "dd/mm/yyyy")}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FixtureSelector;
