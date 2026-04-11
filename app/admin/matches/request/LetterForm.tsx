"use client";

import QuillEditor from "@/components/editor/Quill";
import { useEffect, useState } from "react";
import { generateMatchRequestTemplates } from "./_templates";
import useGetParam from "@/hooks/params";
import { IStaff } from "@/types/staff.interface";
import { TemplatesSelector } from "./TemplatesSelectorModal";

import { Button } from "@/components/buttons/Button";
import { printMatchRequestLetter } from "./Print";
import { icons } from "@/assets/icons/icons";
import { Separator } from "@/components/ui/separator";
import { IMatch } from "@/types/match.interface";
 
 

interface IProps {
  match: IMatch;
  official: { requester: IStaff };
}

export function MatchRequestForm({ match, official }: IProps) {
 
  const [letterForm, setLetterForm] = useState({
    body: "",
    title: "",
  });

  const templateId = useGetParam("templateId");

  useEffect(() => {
    if (templateId) {
      const template = generateMatchRequestTemplates(match, official)?.find(
        (t) => t?.id === templateId,
      );
      if (template) {
        setLetterForm({ body: template.body, title: template.title });
      }
    }
  }, [templateId, match, official]);

  const handlePrint = () => {
    printMatchRequestLetter(letterForm, match, official);
  };

  const handleSaveDraft = async () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft:", letterForm);
   
  };

  return (
    <div>
      <h1 className="font-light text-xl mb-3.5 text-Orange">{match?.title}</h1>
      <Separator className="bg-Orange" />
      <header className="flex flex-wrap items-center justify-between gap-4 py-4">
        <h1 className="_title">Match Request Letter</h1>
        <TemplatesSelector
          match={match}
          official={official}
          modal
          modalVariant="outline"
        />
      </header>
      <QuillEditor
        value={letterForm.body || ""}
        onChange={(text) => {
          setLetterForm((p) => ({ ...p, body: text }));
        }}
        className="w-full"
        placeholder="Type request letter here..."
      />
      <br />
      <section className="grid sm:grid-cols-2 md:grid-cols-3 items-center gap-3.5 flex-wrap">
        <Button
          primaryText="Print"
          waitingText="Generating..."
          className="w-full justify-start font-normal"
          variant="default"
          disabled={!letterForm.body}
          onClick={handlePrint}
        >
          <icons.printer />
        </Button>
        <Button
          primaryText="Save as draft"
          waitingText="Saving..."
          onClick={handleSaveDraft}
          className="w-full justify-start font-normal"
          variant="secondary"
        >
          <icons.save />
        </Button>
      </section>
    </div>
  );
}
