"use client";

import AdminSponsors from "./Sponsors";
 
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetSponsorsQuery } from "@/services/sponsor.endpoints";
import { useSearchParams } from "next/navigation";

const AdminSponsorshipPage = () => {
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: sponsors,
    isLoading,
    error,
    isFetching,
  } = useGetSponsorsQuery(paramsString);

  if (isLoading) {
    return (
      <div className="_page flex justify-center items-center min-h-100">
        <Loader message="Loading sponsors..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="_page">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sponsors:{" "}
            {(error as any)?.message || "Unknown error"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page">
      <AdminSponsors sponsors={sponsors} />

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}
    </div>
  );
};

export default AdminSponsorshipPage;
