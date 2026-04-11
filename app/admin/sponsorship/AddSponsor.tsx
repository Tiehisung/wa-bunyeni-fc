"use client";

import DiveUpwards from "@/components/Animate";
import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";
import BottomSheetLite from "@/components/modals/BottomSheetLite";
import ContentShowcaseWrapper from "@/components/ShowcaseWrapper";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useCreateSponsorMutation } from "@/services/sponsor.endpoints";
import { ImageUploadWidget } from "@/components/cloudinary/ImageUploadWidget";
import { smartToast } from "@/utils/toast";
import { ISponsorProps } from "@/app/sponsorship/page";

export function AddNewSponsor({ sponsors }: { sponsors?: ISponsorProps[] }) {
  const [formData, setFormData] = useState({ ...initialForm });
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const [createSponsor] = useCreateSponsorMutation();

  const OnChangeSponsor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaiting(true);

    try {
      const result = await createSponsor(formData).unwrap();

      if (result.success) setFormData(initialForm);

      smartToast(result);
    } catch (error) {
      smartToast({ error });
    } finally {
      setWaiting(false);
    }
  };

  const checkBusinessExists = (input: string) => {
    const businessNames = sponsors?.map((s) => s.businessName);

    if (
      businessNames?.find(
        (bn) => bn.trim().toLowerCase() === input.trim().toLowerCase(),
      )
    ) {
      setError(`${input} already exists`);
      return;
    }
    setError("");
  };

  useEffect(() => {
    if (formData.businessName) {
      checkBusinessExists(formData.businessName);
    }
  }, [formData.businessName]);

  return (
    <BottomSheetLite
      trigger={
        <span
          className="rounded p-6 border _borderColor hover:opacity-90 _secondaryBtn justify-center"
          title="Add Sponsor"
        >
          <Plus size={40} />
        </span>
      }
      triggerStyles=""
      id="new-sponsor"
      className="_page"
    >
      <ContentShowcaseWrapper
        images={sponsors?.slice(0, 6)?.map((s) => s.logo) ?? []}
        graphicsStyles=""
        className=""
      >
        <form onSubmit={handleSubmit} className="grid grow gap-6 pt-4 _card">
          <h1 className="uppercase _label mb-5 p-4 _gradient">
            Sponsor/Donor Registration
          </h1>
          <div className="flex gap-2 justify-center flex-col items-center relative">
            <ImageUploadWidget
              onUpload={(file) =>
                setFormData({ ...formData, logo: file?.secure_url as string })
              }
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

          {error && (
            <DiveUpwards layoutId={error}>
              <p className="text-error text-sm font-light h-6 text-center">
                {error}
              </p>
            </DiveUpwards>
          )}
          <Button
            type="submit"
            waiting={waiting}
            disabled={waiting || !!error}
            waitingText="Saving sponsor..."
            primaryText="Save"
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
