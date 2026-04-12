import { removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import ArchiveModel from "@/models/Archives";
import { QueryFilter } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

ConnectMongoDb();

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


