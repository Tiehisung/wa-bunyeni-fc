import { EPreset, EPresetType } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { IFileProps ,IFileUpload} from "@/types/file.interface";
import cld from "cloudinary";
import FileModel from "@/models/file";
import { ConnectMongoDb } from "@/lib/dbconfig";
const cloudinary = cld.v2;
//config is populated with cloudname,secret and key from CLOUDINARY_URL in .env by default

ConnectMongoDb();
//Post to cloudinary
export async function POST(request: NextRequest) {
  const {
    name,
    path,
    type,
    preset,
    folder,
    presetType,
    description,
  }: IFileUpload = await request.json();

  
  try {
    if (!path)
      return new Response(
        JSON.stringify({
          message: "File upload failed! File not specified",
          success: false,
        })
      );
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
        upload_preset: preset ?? EPreset.KFC_SIGNED,
        folder: folder,
        use_asset_folder_as_public_id_prefix: true,
        type: presetType ?? EPresetType.AUTHENTICATED,
      })
      .then(async (result) => {
        //Now save to database(MDB)
        return result;
      })
      .catch((err) => {
        return err;
      });

    if (!uploadResult || uploadResult.error) {
      return NextResponse.json({
        message: "Failed to upload",
        data: uploadResult.error.message,
        success: false,
      });
    }

    //Save to database
    const savedFile = await FileModel.create({
      ...uploadResult,
      description,
      name,
    });


    //Return response
    return NextResponse.json({
      data: savedFile,
      success: true,
      message: "File uploaded and saved successfully",
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "File upload failed",
        success: false,
        data: error,
      })
    );
  }
}

/**Delete multiple with Admin API
 * @param {*} request contains request body publicIds[]
 * @returns response object {message: string, success: boolean}
 */
export async function DELETE(request: NextRequest) {
  const files: IFileProps[] = await request.json();
  try {
    //Delete individually

    files.forEach(async ({ public_id, resource_type }) => {
      if (public_id)
        await cloudinary.uploader.destroy(
          public_id!,
          {
            resource_type: resource_type || "image",
            invalidate: true,
          },
          (error, result) => {
            if (error) {
              console.log(error);
            } else {
              console.log({ deleted: result });
            }
          }
        );
    });

    return new Response(
      JSON.stringify({ message: "Deleted", success: true, data: "" })
    );
  } catch (error) {
    return NextResponse.json({
      message: "Failed to delete! ",
      success: false,
      data: error,
    });
  }
}
