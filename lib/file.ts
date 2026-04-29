import { IFileProps } from "@/types/file.interface";
import { bytesToMB } from ".";
import { toast } from "sonner";

export const createFileUrl = (file: File) => URL.createObjectURL(file);

export const getFilePath = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function getFileName(url: string) {
  try {
    return url.split("/").pop()?.split("?")[0] ?? "file";
  } catch {
    return "file";
  }
}

export const getFileExtension = (mediaOrUrl: IFileProps | string): string => {
    if (!mediaOrUrl) return '';
    const fileSplit = typeof mediaOrUrl == 'string' ? mediaOrUrl?.split('.') : mediaOrUrl?.secure_url?.split('.');
    const extension = fileSplit[fileSplit.length - 1];//extension as last element
    return extension.toLowerCase();
};

export const openFileInTab = (fileUrl: string) => {
    if (fileUrl) window.open(fileUrl, '_blank', 'noopener,noreferrer');
    else alert('Invalid file');
};

export const validateFile = (
    file?: File,
    fileType: "image" | "pdf" | "video" | "all" = "all",
    maxSize: number = 10000000
) => {


    if (bytesToMB(file?.size ?? 0) > bytesToMB(maxSize)) {
        return { status: false, message: `File too large. Accepts less than ${bytesToMB(maxSize)} MB` };
    }

    let validMimeTypes: string[] = [];
    switch (fileType) {
        case "image":
            validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            break;
        case "pdf":
            validMimeTypes = ["application/pdf"];
            break;
        case "video":
            validMimeTypes = ["video/mp4", "video/webm", "video/ogg"];
            break;
        case "all":
            validMimeTypes = [];
            break;
    }

    if (
        validMimeTypes.length > 0 &&
        !validMimeTypes.includes(file?.type as string)
    ) {
        return { status: false, message: `Invalid file type. Accepted: ${fileType}` };
    }

    return { status: true, message: '' };
};
 

export const getThumbnail = (
    file?: Partial<IFileProps>,
    options?: {
        width?: number
        height?: number
        second?: number
        crop?: "fill" | "fit" | "limit",
    }
) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const {
        width = 400,
        height = 320,
        second = 4,
        crop = "fill",
    } = options || {}

    const transformations = [
        "f_jpg",                  // WebP/AVIF
        "q_auto:good",             // quality
        `c_${crop}`,
        `w_${width}`,
        `h_${height}`,
    ].join(",")

    const vid_transformations = [
        `so_${second}`,            // seek to timestamp
        "f_auto",                  // WebP/AVIF
        "q_auto:good",             // quality
        "fl_progressive",          // faster load
        `c_${crop}`,
        `w_${width}`,
        `h_${height}`,
    ].join(",")

    if (!file) return ''

    if (file?.resource_type === 'image') return file.secure_url

    if (file?.resource_type === 'raw') return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${file?.public_id}`


    return `https://res.cloudinary.com/${cloudName}/video/upload/${vid_transformations}/${file?.public_id}.jpg`
}


export const downloadFile = (url: string | URL | Request, filename: string) => {
    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch((error) => {
            console.error("Error downloading file:", error);
            toast.error('Error downloading file')
        });
};


 
export function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}