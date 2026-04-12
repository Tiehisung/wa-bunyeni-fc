"use client";

import { Button } from "@/components/buttons/Button";
import { IconInputWithLabel } from "@/components/input/Inputs";
import { Card } from "@/components/ui/card";
import React, { ChangeEvent, useState } from "react";
import { fireDoubleEscape } from "@/hooks/Esc";
import { ITeam } from "@/types/match.interface";
import { getErrorMessage } from "@/lib/error";
import {
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "@/services/team.endpoints";
import { ImageUploadWidget } from "@/components/cloudinary/ImageUploadWidget";
import { smartToast } from "@/utils/toast";
import { ENV } from "@/lib/env";

export interface IPostTeam {
  name: string;
  community: string;
  alias: string;
  logo: string;
  contact: string;
  contactName: string;
}

export interface IUpdateTeam extends IPostTeam {
  _id: string;
}

interface IProps {
  team?: ITeam;
  onSuccess?: () => void;
}

export const TeamForm = ({ team, onSuccess }: IProps) => {
  const [waiting, setWaiting] = useState(false);
  const [createTeam] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  const [formData, setFormData] = useState<any>(
    team
      ? {
          name: team.name || "",
          community: team.community || "",
          alias: team.alias || "",
          contact: team.contact || "",
          contactName: team.contactName || "",
          logo: team.logo || ENV.OPPONENT_LOGO_NO_BG_URL,
        }
      : {
          name: "",
          community: "",
          alias: "",
          contact: "",
          contactName: "",
          logo: ENV.OPPONENT_LOGO_NO_BG_URL,
        },
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p:any) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setWaiting(true);

      let result;
      if (team) {
        result = await updateTeam({
          _id: team._id,
          ...formData,
        }).unwrap();
      } else {
        result = await createTeam(formData).unwrap();
      }

      if (result.success) {
        smartToast(result);

        if (!team) {
          setFormData({
            name: "",
            community: "",
            alias: "",
            contact: "",
            logo: ENV.OPPONENT_LOGO_NO_BG_URL,
            contactName: "",
          });
        }
        onSuccess?.();
        fireDoubleEscape();
      } else {
        smartToast(result);
      }
    } catch (error) {
      smartToast({ error: getErrorMessage(error) });
    } finally {
      setWaiting(false);
    }
  };

  return (
    <Card className="w-fit p-3 mx-auto grow">
      <h1 className="font-bold text-lg mb-2 text-primary text-center uppercase">
        {team ? `Update ${team?.name}` : "Register New Opponent Team"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="p-4 pt-10 max-w-md flex flex-col gap-4 gap-y-8 items-center justify-center mx-center w-full grow md:min-w-sm"
      >
        <div className="flex flex-col items-center justify-center gap-2 mx-auto">
          <ImageUploadWidget
            onUpload={(file) =>
              setFormData({ ...formData, logo: file?.secure_url ?? "" })
            }
            initialImage={team?.logo || ENV.OPPONENT_LOGO_NO_BG_URL}
            onRemove={() =>
              setFormData({ ...formData, logo: team?.logo || "" })
            }
          />
        </div>

        <IconInputWithLabel
          name="name"
          value={formData.name}
          onChange={handleOnChange}
          label="Name"
          required
        />

        <IconInputWithLabel
          name="alias"
          value={formData.alias}
          onChange={handleOnChange}
          label="Alias"
          required
        />

        <IconInputWithLabel
          name="community"
          value={formData.community}
          onChange={handleOnChange}
          label="Community"
          required
        />

        <IconInputWithLabel
          name="contactName"
          value={formData.contactName}
          onChange={handleOnChange}
          label="Contact Person Name"
          required
        />

        <IconInputWithLabel
          name="contact"
          type="tel"
          value={formData.contact}
          onChange={handleOnChange}
          label="Contact"
          required
        />

        <Button
          type="submit"
          waiting={waiting}
          disabled={waiting}
          waitingText="Saving..."
          primaryText="SAVE"
          className="_primaryBtn px-3 py-2 w-full mt-2 justify-center"
        />
      </form>
    </Card>
  );
};
