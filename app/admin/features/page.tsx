"use client";

import { FeatureForm } from "./OptionsFeature";
import { PrimaryCollapsible } from "@/components/Collapsible";
import { GrAdd } from "react-icons/gr";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGetFeaturesQuery } from "@/services/feature.endpoints";

export type TFeatures = "manager_roles";

const FeaturesPage = () => {
  const { data: features, isLoading, error } = useGetFeaturesQuery();

  if (isLoading) {
    return (
      <div className="px-4 _page flex justify-center items-center min-h-100">
        <Loader message="Loading features..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 _page">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load features: {(error as any).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-4 _page">
      <ul className="grid gap-5">
        {features?.data?.map((feature, i) => (
          <li key={feature?._id || `new-feat-${i}`}>
            <PrimaryCollapsible
              header={{
                label: (
                  <span className="uppercase">
                    {feature?.name?.replaceAll("_", " ")}
                  </span>
                ),
                className: "ring",
              }}
            >
              <FeatureForm feature={feature} />
            </PrimaryCollapsible>
          </li>
        ))}
      </ul>
      <br />

      <div className="">
        <PrimaryCollapsible
          header={{
            icon: <GrAdd />,
            label: "Add Feature",
            className: "text-primaryGreen text-lg font-medium",
          }}
        >
          <FeatureForm />
        </PrimaryCollapsible>
      </div>
      <br />
    </div>
  );
};

export default FeaturesPage;
