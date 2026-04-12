import cld from "cloudinary";
const cloudinary = cld.v2;
import { ConnectMongoDb } from "@/lib/dbconfig";
import { IFileUpload } from "@/types/file.interface";
 

ConnectMongoDb();
//Post to cloudinary
export async function fileUploader({
    name,
    path,
    type,
    preset,
    folder,
    presetType,

}: IFileUpload) {

    try {
        if (!path)
            return {
                message: "File not specified",
                success: false,
            }

        const uploadResult = await cloudinary.uploader
            .upload(path, {
                resource_type: type?.includes("video")
                    ? "video"
                    : type?.includes("audio")
                        ? "video"
                        : type?.includes("image")
                            ? "image"
                            : "auto",
                public_id:
                    name?.split(".")[0] +
                    new Date().getMilliseconds() +
                    new Date().getSeconds(),

                unique_filename: true,
                upload_preset: preset ?? "konjiehifc",
                folder: folder,
                use_asset_folder_as_public_id_prefix: true,
                type: presetType || "authenticated",
            })
            .then(async (result) => {
                //Now save to database(MDB)
                return result;
            })
            .catch((err) => {
                return err;
            });

        if (!uploadResult || uploadResult.error) {
            return {
                message: "Failed to upload",
                data: uploadResult.error.message,
                success: false,
            }
        }

        //Return response
        return {
            data: uploadResult,
            success: true,
            message: "File uploaded successfully",
        }
    } catch (error) {
        console.log({ uploadError: error })
        return {
            message: "File upload failed",
            success: false,
            data: error,
        }

    }
}
