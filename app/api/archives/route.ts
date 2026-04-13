import { removeEmptyKeys } from "@/lib";
import connectDB from "@/config/db.config";
import ArchiveModel from "@/models/Archives";
import { QueryFilter } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
  const sourceCollection = request.nextUrl.searchParams.get("sourceCollection");
  const query: QueryFilter<unknown> = {}

  if (sourceCollection) {
    query['sourceCollection'] = sourceCollection
  }

  const cleaned = removeEmptyKeys(query)

  const archives = await ArchiveModel.find(cleaned);
  return NextResponse.json(archives);
}


