import { NextRequest, NextResponse } from "next/server";
import LogModel from "@/models/logs";
import "@/models/user";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { removeEmptyKeys } from "@/lib";
export const dynamic = "force-dynamic";

ConnectMongoDb();
export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "20", 10);

  const search = searchParams.get("log_search") || "";

  const skip = (page - 1) * limit;

  const regex = new RegExp(search, "i");
  const query = {
    $or: [
      { "title": regex },
      { "severity": regex },
      { "user.name": regex },
      { "user.email": regex },
      { "category": regex },
    ],
  };

  const cleaned = removeEmptyKeys(query);

  const logs = await LogModel.find(cleaned)
    .sort({ createdAt: 'desc' })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await LogModel.countDocuments(cleaned);
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



