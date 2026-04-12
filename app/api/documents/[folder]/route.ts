import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { removeEmptyKeys } from "@/lib";
import DocModel from "@/models/doc";
import { TSearchKey } from "@/types";
import { QueryFilter } from "mongoose";

ConnectMongoDb();

export async function GET(request: NextRequest, { params }: { params: Promise<{ folder: string }> }) {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);

    const search = searchParams.get("doc_search") as TSearchKey || "";
    const folder = (await params).folder

    const skip = (page - 1) * limit;

    const regex = new RegExp(search, "i");
    const query = {
        $or: [
            { "name": regex },
            { "original_filename": regex },
            { "folder": regex },
            { "description": regex },
            { "tags": regex },
        ],
    } as QueryFilter<unknown>;


    query.folder = folder


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
