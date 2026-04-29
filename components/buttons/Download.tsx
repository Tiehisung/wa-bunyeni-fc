 "use client";



import { downloadFile } from "@/lib/file";
import { BiDownload } from "react-icons/bi";

export default function DownloadButton({
  fileUrl = "",
  fileName = "filename",
  buttonType = "button" as "button" | "submit" | "reset",
  styles = "secondary__btn",
}) {
  const handleDownloadFile = () => {
    downloadFile(fileUrl, fileName || "file" + new Date().getMilliseconds());
  };
  return (
    <button
      onClick={handleDownloadFile}
      type={buttonType}
      className={`${styles}`}
    >
      <BiDownload />
      {fileName}
    </button>
  );
}
