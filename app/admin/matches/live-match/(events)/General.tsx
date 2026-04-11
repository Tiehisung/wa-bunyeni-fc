"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Input } from "@/components/input/Inputs";
import { Button } from "@/components/buttons/Button";
import { EmojiPicker } from "@/components/input/EmojiPicker";
import { IMatch } from "@/types/match.interface";
import { useUpdateMatchMutation } from "@/services/match.endpoints";
import { smartToast } from "@/utils/toast";

interface GeneralEventsTabProps {
  match: IMatch;
}

export function GeneralEventsTab({ match }: GeneralEventsTabProps) {
  const [form, setForm] = useState({ minute: "", description: "" });
  const [updateMatch, { isLoading }] = useUpdateMatchMutation();

  const handleUpdate = async () => {
    try {
      const result = await updateMatch({
        ...match,
        events: [
          {
            title: form.description,
            minute: Number(form.minute),
            type: "general",
          },
          ...match.events,
        ],
      }).unwrap();
      smartToast(result);
    } catch (error) {
      smartToast({ error });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 rounded-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <h2 className="mb-6 text-2xl font-bold">Add General Event</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 ">
              <div>
                <label className="mb-2 block text-sm font-medium">Minute</label>
                <Input
                  type="number"
                  others={{ min: "0", max: "120" }}
                  placeholder="e.g., 35"
                  value={form.minute}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, minute: e.target.value }))
                  }
                  name={"generalMinutes"}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>
                <Input
                  placeholder="e.g., VAR Review, Penalty Decision, etc."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  name={"generalDescription"}
                />
              </div>
            </div>

            <EmojiPicker
              onSelect={(v) =>
                setForm({ ...form, description: form.description + v.value })
              }
              className="overflow-x-auto _hideScrollbar"
            />
            <Button
              className="w-full "
              waiting={isLoading}
              primaryText=" Add Event"
              waitingText="Adding Event"
              type="submit"
            >
              <Plus className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
