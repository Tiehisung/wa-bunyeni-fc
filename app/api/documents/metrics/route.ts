import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import FolderModel from "@/models/folder";
import DocModel from "@/models/doc";

ConnectMongoDb();

export async function GET(_: NextRequest) {
    const folders = await FolderModel.find().lean()

    const totalDocs = await DocModel.countDocuments()

    const metrics = {
        totalDocs,
        folders: folders.map(f => ({
            ...f,
            docsCount: f.documents.length,
        }))
    };

    return NextResponse.json({
        success: true,
        data: metrics
    });
}