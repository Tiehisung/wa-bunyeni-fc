import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage, removeEmptyKeys } from "@/lib";
import DocModel from "@/models/doc";
import { logAction } from "../logs/helper";
import { ELogSeverity } from "@/types/log";
import FolderModel from "@/models/folder";
import { Document } from "mongoose";
import { IDocFile } from "@/types/doc";
import { TSearchKey } from "@/types";
import { deleteCldAssets } from "../file/route";

ConnectMongoDb();

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);

    const search = searchParams.get("doc_search") as TSearchKey || "";

    const skip = (page - 1) * limit;

    const regex = new RegExp(search, "i");
    const query = {
        $or: [
            { "name": regex },
            { "original_filename": regex },
            { "folder": regex },
            { "description": regex },
        ],
    };

    const cleaned = removeEmptyKeys(query);

    const logs = await DocModel.find(cleaned)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await DocModel.countDocuments(cleaned);
    return NextResponse.json({
        success: true,
        data: logs, pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const { file, folder, format, tags, } = await req.json()

        const doc = await DocModel.insertOne({
            ...file,
            tags,
            folder,
            format,
        });

        //Push to folder
        await FolderModel.findOneAndUpdate({
            name: folder,
        }, { $addToSet: { documents: (doc as Document)?._id } });

        // log
        await logAction({
            title: `Document uploaded to - ${folder}`,
            description: `${file.name ?? file.original_filename} uploaded on ${Date.now()}` as string,
        });
        return NextResponse.json({
            success: true,
            message: "New Document Uploaded",
            data: doc,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getErrorMessage(error, "Failed to upload document"),
        });
    }
}

//Delete from Cloud then pull id from collection files field
export async function DELETE(req: NextRequest) {
    try {
        const documentFile = await req.json() as IDocFile;
        //Delete file from cloudinary
        await deleteCldAssets([{ ...documentFile }])

        //Delete file data from database
        const deleteFromDb = await DocModel.findOneAndDelete({
            _id: documentFile?._id
        });

        // Remove from folder
        await FolderModel
            .updateMany(
                { documents: documentFile?._id },   // only folders that contain it
                {
                    $pull: { documents: documentFile?._id }
                })

        // log
        await logAction({
            title: `Document deleted - ${documentFile?.name ?? documentFile?.original_filename}`,
            description: `${documentFile?.original_filename} deleted from  ${documentFile?.folder}`,
            severity: ELogSeverity.CRITICAL,
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