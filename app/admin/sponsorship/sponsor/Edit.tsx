"use client";

import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";
import ContentShowcaseWrapper from "@/components/ShowcaseWrapper";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import BottomSheetLite from "@/components/modals/BottomSheetLite";
import { useUpdateSponsorMutation } from "@/services/sponsor.endpoints";
import   ImageUploadWidget   from "@/components/cloudinary/ImageUploadWidget";
import { smartToast } from "@/utils/toast";
import { ISponsorProps } from "@/app/sponsorship/page";

export function EditSponsor({ sponsor }: { sponsor?: ISponsorProps }) {
  const [updateSponsor] = useUpdateSponsorMutation();
  const [formData, setFormData] = useState({ ...initialForm });
  const [waiting, setWaiting] = useState(false);

  // Initialize form with sponsor data when available
  useEffect(() => {
    if (sponsor) {
      setFormData({
        name: sponsor.name || "",
        phone: sponsor.phone || "",
        logo: sponsor.logo || "",
        businessName: sponsor.businessName || "",
        businessDescription: sponsor.businessDescription || "",
      });
    }
  }, [sponsor]);

  const OnChangeSponsor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sponsor?._id) return;

    setWaiting(true);
    try {
      const result = await updateSponsor({
        _id: sponsor._id,
        ...formData,
      }).unwrap();

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    } finally {
      setWaiting(false);
    }
  };

  return (
    <BottomSheetLite
      trigger={
        <>
          <Edit /> Edit sponsor
        </>
      }
      triggerStyles="_primaryBtn justify-center"
      id="edit-sponsor"
    >
      <ContentShowcaseWrapper
        images={
          sponsor?.donations
            ?.slice(0, 3)
            ?.map((d) => d.files)
            ?.flat(1)
            ?.filter((f) => f.resource_type === "image")
            ?.map((f) => f.secure_url) ?? []
        }
        graphicsStyles=""
      >
        <form onSubmit={handleSubmit} className="grid gap-6 pt-4 _card grow">
          <div className="flex gap-2 justify-center flex-col items-center relative">
            <ImageUploadWidget
              onUpload={(file) =>
                setFormData({ ...formData, logo: file?.secure_url as string })
              }
              initialImage={sponsor?.logo}
            />
          </div>

          <IconInputWithLabel
            onChange={OnChangeSponsor}
            value={formData.name}
            name="name"
            label="Owner name"
          />
          <IconInputWithLabel
            onChange={OnChangeSponsor}
            value={formData.businessName}
            label="Business name"
            name="businessName"
            required
          />
          <IconInputWithLabel
            onChange={OnChangeSponsor}
            value={formData.businessDescription}
            label="Business description"
            name="businessDescription"
          />
          <IconInputWithLabel
            onChange={OnChangeSponsor}
            value={formData.phone}
            label="Phone"
            name="phone"
            type="tel"
          />

          <Button
            type="submit"
            waiting={waiting}
            disabled={waiting}
            waitingText="Saving sponsor..."
            primaryText="Save Changes"
            className="_primaryBtn w-full py-1 my-3 px-10 mx-auto justify-center text-lg md:text-xl"
          />
        </form>
      </ContentShowcaseWrapper>
    </BottomSheetLite>
  );
}

const initialForm = {
  name: "",
  phone: "",
  logo: "",
  businessName: "",
  businessDescription: "",
};
