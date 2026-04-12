"use client";

import HEADER from "@/components/Element";
import StaffForm from "../StaffForm";
import { useGetStaffMemberQuery } from "@/services/staff.endpoints";
import Loader from "@/components/loaders/Loader";
import DataErrorAlert from "@/components/error/DataError";
import { useRouter } from "next/navigation";
import useGetParam from "@/hooks/params";

const EditStaffPage = () => {
  const staffId = useGetParam("staffId");
  const router = useRouter();

  const { data, isLoading, error, refetch } = useGetStaffMemberQuery(staffId!);
  if (isLoading) return <Loader />;

  if (error || !data) {
    return (
      <div className="min-h-screen p-6">
        <DataErrorAlert message={error} onRefetch={() => refetch()} />
      </div>
    );
  }
  return (
    <div>
      <HEADER title="EDIT STAFF" />
      <br />
      <StaffForm
        className="_page"
        existingStaff={data?.data}
        onSuccess={() => router.back()}
      />
    </div>
  );
};

export default EditStaffPage;
