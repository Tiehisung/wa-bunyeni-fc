"use client";

import { IQueryResponse } from "@/types";
import GalleryGrid from "@/components/Gallery/GallaryGrid";
import DonationForm from "./DonationForm";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/pagination/Pagination";
import { PrimaryAccordion } from "@/components/ui/accordion";
 
import { IDonation } from "@/types/donation.interface";
import { IGallery } from "@/types/file.interface";
import { ISponsorProps } from "@/app/sponsorship/page";

export function DisplayDonations({
  sponsor,
  donations,
}: {
  sponsor?: ISponsorProps;
  donations?: IQueryResponse<IDonation[]>;
}) {
  const galleries: IGallery[] =
    donations?.data?.map((d) => ({
      ...d,
      tags: [],
      title: d.item,
      _id: d._id,
      files: d.files || [],
      description: d.description,
      createdAt: d.createdAt,
    })) ?? [];

  return (
    <div id="support" className="space-y-6">
      <PrimaryAccordion
        data={[
          {
            trigger: (
              <Button variant="default" className="cursor-pointer">
                Donate Now
              </Button>
            ),
            value: "donate",
            content: (
              <div className="bg-card p-4 rounded-2xl">
                <DonationForm sponsor={sponsor} />
              </div>
            ),
          },
        ]}
      />
      <div />
      <GalleryGrid galleries={galleries} />
      <Pagination pagination={donations?.pagination} />
    </div>
  );
}
