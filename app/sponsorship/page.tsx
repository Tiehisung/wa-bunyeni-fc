'use client'

import { staticImages } from "@/assets/images";
import HEADER from "@/components/Element";
import SponsorUs from "./SponsorUs";
import MarqueeCarousel from "@/components/carousel/marquee";
import { ICloudinaryFile } from "@/types/file.interface";
import { useGetSponsorsQuery } from "@/services/sponsor.endpoints";
import Loader from "@/components/loaders/Loader";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { PageSEO } from "@/utils/PageSEO";

export default function SponsorsPage() {
  const { data: sponsorsData, isLoading, error } = useGetSponsorsQuery("");
  const sponsors = sponsorsData;

  if (isLoading) {
    return (
      <div className="">
        <HEADER title="SUPPORT & SPONSORS" />
        <main className=" p-5 flex justify-center items-center min-h-100">
          <Loader message="Loading sponsors..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <HEADER title="SUPPORT & SPONSORS" />
        <main className=" p-5">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load sponsors. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <>
      {/* <PageSEO page="sponsors" /> */}

      <div className="">
        <HEADER title="SUPPORT & SPONSORS" />
        <main className=" p-5">
          <SponsorUs />
          <br />

          <MarqueeCarousel>
            {sponsors?.data?.map((sponsor) => (
              <div
                className="border-t-4 border-Blue rounded-t h-32 w-fit px-5 bg-card flex items-center gap-1 flex-wrap justify-center shadow-xl mx-2"
                key={sponsor?._id}
              >
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <img
                    src={sponsor?.logo ?? staticImages.ball}
                    alt={sponsor?.name}
                    className="w-14 h-14 object-contain"
                  />
                  <span className="text-sm">{sponsor?.name}</span>
                </div>
              </div>
            ))}
          </MarqueeCarousel>
        </main>
      </div>
    </>
  );
}

export interface ISponsorProps {
  _id: string;
  badges: number;
  logo: string;
  businessName: string;
  businessDescription: string;
  name: string;
  phone: string;
  donations?: IDonation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IDonation {
  _id: string;
  item: string;
  description: string;
  files: ICloudinaryFile[];
  sponsor: ISponsorProps;
  createdAt?: string;
  updatedAt?: string;
}
