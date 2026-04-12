import { apiConfig } from "@/lib/configs";
import { ConnectMongoDb } from "@/lib/dbconfig";
import FileModel from "@/models/file";
import {   IQueryResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { IFileProps } from "@/types/file.interface";
 

ConnectMongoDb();

//Update database file metadata
export async function PUT() {
  try {
    await FileModel.find({});

    return NextResponse.json({
      message: "File updated successfully",
      success: true,
      data: "file",
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to update file.",
      success: false,
      data: error,
    });
  }
}

//Delete from Cloud then pull id from collection files field
export async function DELETE(req: NextRequest) {
  try {
    const files: IFileProps[] = await req.json();
    //Delete file from cloudinary
    await fetch(apiConfig.fileUpload, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(files),
    });

    //Delete file data from database
    const deleteFromDb = await FileModel.deleteMany({
      _id: { $in: files.map((f) => f._id) },
    });

    return NextResponse.json({
      message: "Delete  successful ",
      success: true,
      data: deleteFromDb,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to delete file.",
      success: false,
      data: error,
    });
  }
}
export async function GET() {
  try {
    const files = await FileModel.find({});
    return NextResponse.json({
      message: "File retrieved successfully",
      success: true,
      data: files,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to fetch",
      success: false,
      data: error,
    });
  }
}


export async function deleteCldAssets(files: { public_id: string, resource_type?: string }[],) {
  try {
    //Delete file from cloudinary
    const response = await fetch(apiConfig.fileUpload, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(files),
    });
    const result: IQueryResponse = await response.json()
    return result
  } catch (error) {
    return { data: error, success: false, } as IQueryResponse
  }
}