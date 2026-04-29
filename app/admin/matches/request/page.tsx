"use client";

import { MatchRequestForm } from "./LetterForm";
import FixtureSelector from "./FixtureSelector";
import { EMatchStatus, IMatch } from "@/types/match.interface";
import { useGetMatchesQuery } from "@/services/match.endpoints";
import Loader from "@/components/loaders/Loader";
import { TEAM } from "@/data/team";
import { IStaff } from "@/types/staff.interface";
import { useGetStaffMembersQuery } from "@/services/staff.endpoints";
import { useAppSelector } from "@/store/hooks/store";
import { useSearchParams } from "next/navigation";

const MatchRequestPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const  searchParams   = useSearchParams();
  const fixtureId = searchParams.get("fixtureId");

  const { data: fixturesData, isLoading: fixturesLoading } = useGetMatchesQuery(
    { status: EMatchStatus.UPCOMING },
  );

  const { data: staffData, isLoading: staffLoading } =
    useGetStaffMembersQuery("");

  const isLoading = fixturesLoading || staffLoading;
  const fixtures = fixturesData;

  const requester =
    staffData?.data?.[0] ??
    ({
      fullname: user?.name,
      role: `${TEAM.name} Official`,
      phone: TEAM.contact,
    } as IStaff);

  const selectedFixture = fixtures?.data?.find((f) => f?._id === fixtureId);

  if (isLoading) {
    return (
      <div>
        <main className=" py-12 space-y-10">
          <div className="flex justify-center items-center min-h-100">
            <Loader message="Loading match request data..." />
          </div>
        </main>
      </div>
    );
  }

 
  return (
    <div>
      <main className=" py-12 space-y-10">
        {!fixtureId ? (
          <FixtureSelector fixtures={fixtures} />
        ) : (
          <MatchRequestForm
            match={selectedFixture as IMatch}
            official={{
              requester,
            }}
          />
        )}
      </main>
    </div>
  );
};

export default MatchRequestPage;
