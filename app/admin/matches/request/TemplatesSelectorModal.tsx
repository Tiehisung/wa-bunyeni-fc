"use client";

import { ETemplateTag, generateMatchRequestTemplates } from "./_templates";
import { IStaff } from "@/types/staff.interface";
import TemplateCard from "./TemplateCard";
import { useUpdateSearchParams } from "@/hooks/params";
import { fireEscape } from "@/hooks/Esc";
import { SideDrawer } from "@/components/ShadSideDrawer";
import { useMemo, useState } from "react";
import { enumToOptions } from "@/lib/select";
import { Button } from "@/components/buttons/Button";
import { Separator } from "@/components/ui/separator";
import { TButtonVariant } from "@/components/ui/button";
import { IMatch } from "@/types/match.interface";

interface IProps {
  match: IMatch;
  official: { requester: IStaff };
  searchString?: string;
  modal?: boolean;
  modalVariant?: TButtonVariant;
}

export function TemplatesSelector({
  match,
  official,
  modal,
  modalVariant,
}: IProps) {
  const allTemplates = generateMatchRequestTemplates(match, official);
  const { setParam } = useUpdateSearchParams();
  const [tag, setTag] = useState("");

  const filteredTemplates = useMemo(() => {
    if (tag) return allTemplates?.filter((t) => t.tag == tag);
    else return allTemplates;
  }, [allTemplates, tag]);

  const tagsSelector = (
    <div className="flex items-center gap-1.5 overflow-auto _hideScrollbar p-1">
      {enumToOptions(ETemplateTag)?.map((tg) => (
        <Button
          key={tg?.label}
          primaryText={tg?.label}
          onClick={() => {
            setTag(tg?.value);
          }}
          variant={tag == tg?.value ? "default" : "outline"}
          disabled={tag == tg?.value}
        />
      ))}
    </div>
  );

  if (modal)
    return (
      <SideDrawer
        trigger="Choose Template"
        className="p-[2vw]"
        header={tagsSelector}
        side="bottom"
        roundedTop
        variant={modalVariant}
      >
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates?.map((template) => (
            <TemplateCard
              key={template?.id}
              template={template}
              onClick={() => {
                setParam("templateId", template?.id);
                fireEscape();
              }}
              className="border"
            />
          ))}
        </div>
      </SideDrawer>
    );

  return (
    <div>
      <h1 className="text-lg font-semibold text-Orange ">
        Start with a template
      </h1>
      <div>{tagsSelector}</div>

      <Separator className="my-2.5" />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates?.map((template) => (
          <TemplateCard
            key={template?.id}
            template={template}
            onClick={() => {
              setParam("templateId", template?.id);
              fireEscape();
            }}
            className="border"
          />
        ))}
      </div>
    </div>
  );
}
