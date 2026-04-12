import { ConnectMongoDb } from "@/lib/dbconfig";
import DonationModel from "@/models/donation";
import { NextRequest, NextResponse } from "next/server";
import "@/models/sponsor";
import { removeEmptyKeys } from "@/lib";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);


  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("donation_search") || "";
  const sponsorId = searchParams.get("sponsorId") || "";

  const regex = new RegExp(search, "i");

  let query = {}

  if (search) query = {
    $or: [
      { "item": regex },
      { "description": regex },
      { "date": regex },
    ],
 
  }

  if (sponsorId) query = { ...query, sponsor: sponsorId }

  const cleaned = removeEmptyKeys(query)

  const donations = await DonationModel.find(cleaned)
    .populate({ path: "sponsor" })
    .limit(limit)
    .skip(skip)
    .lean().sort({ createdAt: "desc" });

  const total = await DonationModel.countDocuments(cleaned)

  return NextResponse.json({
    success: true, data: donations, pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
