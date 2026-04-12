import { FaFilePdf, FaFileExcel, FaRegFilePowerpoint } from "react-icons/fa6";
import { PiMicrosoftWordLogoFill } from "react-icons/pi";
import { TbFileUnknown } from "react-icons/tb";
import { Color } from "@/styles";
import { FileText, Image, Music, Video } from "lucide-react";

const extensionMap: Record<string, TFileTypeName> = {
  doc: "word",
  docx: "word",
  ppt: "powerpoint",
  pptx: "powerpoint",
  txt: "textfile",
  md: "textfile",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  mp4: "video",
  avi: "video",
  mov: "video",
  mkv: "video",
  webm: "video",
  pdf: "pdf",
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  xls: "excel",
  xlsx: "excel",
  csv: "excel",
};

// Icon components mapping
export const FileIcon: Record<TFileTypeName, any> = {
  word: PiMicrosoftWordLogoFill,
  powerpoint: FaRegFilePowerpoint,
  textfile: FileText,
  audio: Music,
  video: Video,
  pdf: FaFilePdf,
  image: Image,
  unknown: TbFileUnknown,
  excel: FaFileExcel,
};

// Color mapping
const fileColor: Record<TFileTypeName, string> = {
  word: Color.blue,
  powerpoint: Color.red,
  textfile: Color.grey,
  audio: Color.grey,
  video: Color.red,
  pdf: Color.red,
  image: Color.blue,
  unknown: Color.grey,
  excel: Color.green,
};

// Helper function to get icon by file extension
/**
 *
 * @param fileFormatOrNameOrUrl format or url or original_filename as returned from cloudinary.
 * @param className custom tw classes
 * @param size number size such as 32, 20 etc
 * @returns ReactNode
 */
export const getFileIconByExtension = (
  fileFormatOrNameOrUrl: string,
  className?: string,
  size: number = 24,
) => {
  const extension = fileFormatOrNameOrUrl?.split(".")?.pop()?.toLowerCase();

  const type = extensionMap[extension as string] || "unknown";

  const IconComponent = FileIcon[type];
  
  if (!IconComponent) return null;
  return (
    <IconComponent className={className} size={size} color={fileColor[type]} />
  );
};

export type TFileTypeName =
  | "image"
  | "video"
  | "word"
  | "powerpoint"
  | "pdf"
  | "textfile"
  | "audio"
  | "excel"
  | "unknown";
