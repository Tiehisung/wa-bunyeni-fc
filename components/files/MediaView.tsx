import { IFileProps } from "@/types/file.interface";
 
export function MediaPreview({ file,className }: { file: IFileProps,className?:string }) {
  const isVideo = file?.resource_type === "video";

  return (
    <div className={`relative aspect-square overflow-hidden rounded-lg ${className}`}>
      {isVideo ? (
        <video
          src={file?.secure_url}
          controls={false}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
      ) : (
        <img
          src={file?.secure_url}
          alt={file?.original_filename || "gallery file"}
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
