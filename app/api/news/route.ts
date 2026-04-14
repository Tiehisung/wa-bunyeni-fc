import { IPostNews } from "@/app/admin/news/NewsForm";
import connectDB from "@/config/db.config";
import NewsModel from "@/models/news";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../logs/helper";
import { QueryFilter } from "mongoose";
import { TSearchKey } from "@/types";
import { removeEmptyKeys } from "@/lib";
import { slugify } from "@/lib/slugging";
import { getApiErrorMessage } from "../../../lib/error-api";
import { auth } from "@/auth";

connectDB();
export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);

  const search = searchParams.get("news_search" as TSearchKey) || "";
  const isTrending = searchParams.get("isTrending") == "true";
  const isLatest = searchParams.get("isLatest") == 'true' ? true : false;
  const isPublished = searchParams.get("isPublished") == 'true' ? true : false;
  const isUnpublished = searchParams.get("isPublished") == 'false' ? true : false;
  const hasVideo = searchParams.get("hasVideo") == 'true' ? true : false;

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const skip = (page - 1) * limit;

  const regex = new RegExp(search, "i");

  const query = {} as QueryFilter<unknown>;

  if (isTrending) {
    query["stats.isTrending"] = true
  }

  if (isLatest) query["stats.isLatest"] = true

  if (hasVideo) query["stats.hasVideo"] = true

  if (isPublished) query["isPublished"] = true

  if (isUnpublished) query["isPublished"] = false

  if (from || to) {
    query.createdAt = {};

    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  if (search)
    query.$or = [
      { "headline.text": regex }
    ]


  const cleaned = removeEmptyKeys(query)

  const news = await NewsModel.find(cleaned)

    .sort({ createdAt: "desc" }).skip(skip)
    .limit(limit)
    .lean({ virtuals: true });

  const total = await NewsModel.countDocuments(cleaned)

  return NextResponse.json({
    success: true,
    data: news,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const { headline, details, }: IPostNews = await request.json();
    const slug = slugify(headline.text as string);


    const published = await NewsModel.create({
      slug,
      headline,
      details,
      createdBy: session?.user
    });
    // log
    await logAction({
      title: "News Created",
      description: headline.text as string,

    });
    if (published)
      return NextResponse.json({
        message: "News published",
        success: true,
        data: published,
      });
  } catch (error) {
    return NextResponse.json({
      message: getApiErrorMessage(error, "Failed to publish! "),
      success: false,
    });
  }
}
