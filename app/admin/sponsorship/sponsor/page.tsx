"use client";

import { DisplayDonations } from "./Donation";
import DonorBadging from "./Badging";
import AdminSponsorOverview from "./Overview";
import { EditSponsor } from "./Edit";
import { ConfirmActionButton } from "@/components/buttons/ConfirmAction";
 import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
 
import { useGetDonationsQuery } from "@/services/donation.endpoints";
import {
  useGetSponsorQuery,
  useDeleteSponsorMutation,
} from "@/services/sponsor.endpoints";
import { smartToast } from "@/utils/toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function AdminSponsor() {
  const router = useRouter();
  const sponsorId = useParams().sponsorSlug;
  const  searchParams  = useSearchParams();
  const paramsString = searchParams.toString();

  const {
    data: sponsorData,
    isLoading: sponsorLoading,
    error: sponsorError,
  } = useGetSponsorQuery(sponsorId?.toString() || "");

 

  const { data: donationsData, isLoading: donationsLoading } =
    useGetDonationsQuery(paramsString);

  const [deleteSponsor] = useDeleteSponsorMutation();

  const isLoading = sponsorLoading || donationsLoading;
  const sponsor = sponsorData?.data;
  const donations = donationsData;

  const handleDelete = async () => {
    try {
      const result = await deleteSponsor(sponsorId?.toString() || "").unwrap();
      smartToast(result);
      if (result.success) router.back();
    } catch (error) {
      smartToast({ error });
    }
  };

  if (isLoading) {
    return (
      <div className="_page flex justify-center items-center min-h-100">
        <Loader message="Loading sponsor details..." />
      </div>
    );
  }

  if (sponsorError || !sponsor) {
    return (
      <div className="_page p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load sponsor:{" "}
            {(sponsorError as any)?.message || "Sponsor not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="_page flex flex-col items-center justify-center gap-16 py-10 w-full">
      <div
        className="h-screen w-full rounded-t-md z-[-1] fixed inset-0 bottom-0 bg-no-repeat bg-cover opacity-30"
        style={{ backgroundImage: `url(${sponsor?.logo})` }}
      />

      <AdminSponsorOverview sponsor={sponsor} />

      <DisplayDonations sponsor={sponsor} donations={donations} />

      <DonorBadging sponsor={sponsor} />

      <div className="flex items-center justify-center rounded-2xl gap-8 ring ring-Red w-full">
        <EditSponsor sponsor={sponsor} />

        <ConfirmActionButton
          primaryText="Delete Sponsor"
          onConfirm={handleDelete}
          variant="destructive"
          title="Delete sponsor"
          confirmText={`Are you sure you want to delete ${sponsor?.name}?`}
        />
      </div>
    </div>
  );
}
