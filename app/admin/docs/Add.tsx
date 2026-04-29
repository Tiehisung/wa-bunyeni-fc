"use client";

import { POPOVER } from "@/components/ui/popover";
import { FaPlus } from "react-icons/fa6";
import { FolderForm } from "./folders/FolderForm";
import { DIALOG } from "@/components/Dialog";
import { FolderPlus } from "lucide-react";
import { DocumentUploader } from "./DocUploader";

const DocsAddBtn = () => {
  return (
    <>
      <POPOVER
        trigger={
          <>
            <FaPlus className="" size={32} /> New
          </>
        }
        triggerClassNames="fixed right-6 top-16 border"
        size={"default"}
        variant={"secondary"}
      >
        <div className="">
          <DIALOG
            trigger={
              <>
                <FolderPlus /> New Folder
              </>
            }
            triggerStyles="justify-start w-full"
            className="md:p-5"
            variant={"ghost"}
          >
            <FolderForm />
          </DIALOG>
          <DocumentUploader className="w-full my-2" />
        </div>
      </POPOVER>
    </>
  );
};

export default DocsAddBtn;
