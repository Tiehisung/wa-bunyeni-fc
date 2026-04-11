'use client'
import { GalleryUploader } from "@/components/files/gallery-uploader";
import { VideoUploader } from "@/components/files/video/uploader";
import { ImageUploader } from "@/components/files/image-uploader";
// import GroupedAdminSidebar from "../admin/(sidebar)/GroupedSidebarLinks";
import { CloudinaryWidget } from "@/components/cloudinary/Cloudinary";
import GlassmorphicTest from "./Glassmorphic";

export default function TestPage() {
  return (
    <div className="grid md:flex items-center ">
      <main className="block p-5">
        <GlassmorphicTest />
        {/* <GroupedAdminSidebar /> */}
        <ImageUploader onUpload={(url) => console.log(url)} />

        <br />

        <GalleryUploader />

        <br />

        <VideoUploader />
        <CloudinaryWidget />
      </main>
    </div>
  );
}
