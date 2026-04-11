"use client";

import HEADER from "@/components/Element";
import BackToTopButton from "@/components/scroll/ToTopBtn";
import { useGetInjuriesQuery } from "@/services/injuries.endpoints";
 
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InjuriesManager } from "./InjuresManager";
import { useSearchParams } from "next/navigation";

export default function InjuryPage() {
  const  searchParams  = useSearchParams();
  const queryString = searchParams.toString()
    ? `?${searchParams.toString()}`
    : "";

  // Fetch injuries using RTK Query
  const {
    data: injuriesData,
    isLoading,
    error,
    isFetching,
  } = useGetInjuriesQuery(queryString);

  console.log(injuriesData);

  if (isLoading) {
    return (
      <div className="_page">
        <HEADER
          title="Injuries Management"
          subtitle="Track and manage player injuries"
        />
        <div className="flex justify-center items-center min-h-100">
          <Loader message="Loading injuries..." />
        </div>
        <BackToTopButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="_page">
        <HEADER
          title="Injuries Management"
          subtitle="Track and manage player injuries"
        />
        <div className="px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load injuries:{" "}
              {(error as any)?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </div>
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div className="_page">
      <HEADER
        title="Injuries Management"
        subtitle="Track and manage player injuries"
      />

      <InjuriesManager />

      {isFetching && (
        <div className="fixed bottom-4 right-4">
          <Loader size="sm" message="Updating..." />
        </div>
      )}

      <BackToTopButton />
    </div>
  );
}
