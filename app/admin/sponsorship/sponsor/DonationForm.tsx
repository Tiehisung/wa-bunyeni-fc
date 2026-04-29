"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/buttons/Button";
import {
  DateTimeInput,
  IconInputWithLabel,
  TextArea,
} from "@/components/input/Inputs";
import { CgAttachment } from "react-icons/cg";
import { ICloudinaryFile } from "@/types/file.interface";
import { getErrorMessage } from "@/lib/error";
import { useCreateDonationMutation } from "@/services/donation.endpoints";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import { ISponsorProps } from "@/app/sponsorship/page";
import { useParams } from "next/navigation";

const initialForm = {
  item: "",
  date: "",
  value: "",
  description: "",
  files: [],
};

export default function DonationForm({ sponsor }: { sponsor?: ISponsorProps }) {
  const params = useParams();
  const [waiting, setWaiting] = useState(false);
  const [formData, setFormData] = useState<{
    item: string;
    date: string;
    value: string;
    description: string;
    files: ICloudinaryFile[];
  }>(initialForm);

  const [createDonation] = useCreateDonationMutation();

  const sponsorId = params?.sponsorId ?? sponsor?._id;

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sponsor) {
      toast.error("Sponsor ID is missing");
      return;
    }

    try {
      setWaiting(true);

      const result = await createDonation({
        sponsor,
        ...formData,
      }).unwrap();

      if (result.success) {
        toast.success(result.message);
        setFormData(initialForm);
        // setClearFiles((p) => p + 1);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Error saving donation"));
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div>
      <h1 className="_title">Support the club</h1>
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col gap-8 pt-8 justify-center items-center min-w-60 _card"
      >
        <IconInputWithLabel
          onChange={handleOnChange}
          value={formData.item}
          label="Item(s)"
          name="item"
          required
        />
        <IconInputWithLabel
          onChange={handleOnChange}
          value={formData.value}
          label="Est. value(GHS)"
          name="value"
          type="number"
        />
        <TextArea
          onChange={handleOnChange}
          value={formData.description}
          label="Comment"
          name="description"
        />

        <DateTimeInput
          onChange={handleOnChange}
          value={formData.date}
          name="date"
          type="date"
          label="Date received"
          className=""
          wrapperStyles="w-full"
        />

        <div className="relative w-full border p-4">
          <p className="_label mb-2">Attach files of items(Optional)</p>

          <CloudinaryWidget
            onUploadSuccess={(fs) => setFormData({ ...formData, files: fs })}
            maxFiles={10}
            trigger={
              <span className="hover:bg-accent p-1.5 rounded-md flex text-xs items-center font-light ml-auto _secondaryBtn">
                <CgAttachment size={24} /> Attach Media
              </span>
            }
            folder={`donations/${sponsor?.name ?? sponsorId}`}
          />
        </div>

        <br />
        <hr />
        {formData.item && formData.date && (
          <Button
            type="submit"
            primaryText="Save"
            className="_primaryBtn px-4 py-2 rounded shadow grow justify-center w-full"
            waiting={waiting}
            disabled={waiting}
            waitingText="Submitting..."
          />
        )}
      </form>

      <br />
    </div>
  );
}
