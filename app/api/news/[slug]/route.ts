import { getErrorMessage, } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import NewsModel from "@/models/news";
import { NextRequest, NextResponse } from "next/server";
import { QueryFilter } from "mongoose";
import ArchiveModel from "@/models/Archives";
import { EArchivesCollection } from "@/types/archive.interface";
import { logAction } from "../../logs/helper";
import { ELogSeverity } from "@/types/log";
import { formatDate } from "@/lib/timeAndDate";
import { slugIdFilters } from "@/lib/api";

ConnectMongoDb();

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;

    const news = await NewsModel.findOne(slugIdFilters(slug));
    return NextResponse.json(news);
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const slug = (await params).slug;
        const query = { $or: [{ slug }, { _id: slug }] } as QueryFilter<string>

        //First retrieve item
        const foundNewsItem = await NewsModel.findOne(query);

        //Then archive
        await ArchiveModel.updateOne(
            { sourceCollection: EArchivesCollection.NEWS, originalId: foundNewsItem?._id },
            { $push: { data: { ...foundNewsItem, isLatest: false } } }
        );

        //Then delete from main collection
        const deleted = await NewsModel.findOneAndDelete(query);

        await logAction({
            title: `News deleted - [${deleted?.headline?.text}]`,
            description: `A news item(${deleted?.headline?.text}) deleted. on ${formatDate(new Date().toISOString()) ?? ''}.`,
            severity: ELogSeverity.CRITICAL,
            meta: deleted?.toString(),
        });
        return NextResponse.json({
            message: "News deleted",
            success: true,
        });
    } catch (error) {
        return NextResponse.json({
            message: getErrorMessage(error, "Failed to delete! "),
            success: false,
        });
    }
}

// Edit
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const slug = (await params).slug;
        const query: QueryFilter<string> = slugIdFilters(slug)

        console.log(query)

        const body = await request.json();

        //update field
        const updated = await NewsModel.findOneAndUpdate(
            query,
            { $set: { ...body } }
        );

        console.log(updated)

        return NextResponse.json({
            message: "News updated",
            success: true,
            data:updated
        });
    } catch (error) {
        return NextResponse.json({
            message: getErrorMessage(error, "Failed to update! "),
            success: false,
        });
    }
}
