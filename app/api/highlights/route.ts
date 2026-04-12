import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import HighlightModel, { IPostHighlight } from "@/models/highlight";
import { logAction } from "../logs/helper";
import { formatDate } from "@/lib/timeAndDate";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("highlight_search") || "";
    const tags = (searchParams.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const skip = (page - 1) * limit;
    const regex = new RegExp(search, "i");

    // Build Query Object
    const query: Record<string, unknown> = {};

    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const cleaned = removeEmptyKeys(query);

    // Apply filters here
    const highlights = await HighlightModel.find(cleaned)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await HighlightModel.countDocuments(cleaned);

    return NextResponse.json({
      success: true,
      data: highlights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const { match, ...others } = (await request.json()) as IPostHighlight;

    //Create highlight 
    const savedHighlight = await HighlightModel.create({
      match, ...others
    });
   // log
   await logAction({
     title: `Match highlight created - [${others?.title??''}]`,
     description: `A match highlight(${others?.title}) created on ${formatDate(new Date().toISOString()) ?? ''}.`,
     meta: savedHighlight?.toString(),
   });

    return NextResponse.json({
      message: "Highlight created",
      success: true,
      data: savedHighlight,
    });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error, "Failed to save highlight"),
      success: false,
    });
  }
}


