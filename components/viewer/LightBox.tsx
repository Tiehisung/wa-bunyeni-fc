 'use client'
 
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { getFileName } from "@/lib/file";

 

export interface ILightboxMedia {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: "image" | "video";
}

interface ControllerProps {
  closeOnPullUp?: boolean;
  closeOnPullDown?: boolean;
  closeOnBackdropClick?: boolean;
  disableSwipeNavigation?: boolean;
}

interface VideoSettings {
  controls?: boolean;
  preload?: "auto" | "metadata" | "none";
  autoPlay?: boolean;
}
interface LightboxViewerProps {
  open: boolean;
  onClose: () => void;
  files: ILightboxMedia[]; // now supports video
  index?: number;
  controller?: ControllerProps;
  videoSettings?: VideoSettings;
}

/**
 * Custom Lightbox Viewer Component (Image + Video)
 */
export default function LightboxViewer({
  open,
  onClose,
  files,
  index = 0,
  controller,
  videoSettings = { autoPlay: true },
}: LightboxViewerProps) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={files.map((item) =>
        item?.type === "video"
          ? {
              type: "video",
              sources: [{ src: item.src, type: "video/mp4" }],
              poster: `${item.src}?poster=true`,
              download: {
                url: item.src,
                filename: item?.alt || getFileName(item.src) || "video",
              },
            }
          : {
              src: item.src,
              alt: item.alt,
              width: item.width,
              height: item.height,
              download: {
                url: item.src,
                filename: item?.alt || getFileName(item.src) || "IMG",
              },
            }
      )}
      index={index}
      plugins={[Zoom, Download, Thumbnails, Video]}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      controller={{ closeOnBackdropClick: true, ...controller }}
      video={{
        controls: true,
        preload: "metadata",
        autoPlay: false,
        ...videoSettings,
      }}
    />
  );
}
