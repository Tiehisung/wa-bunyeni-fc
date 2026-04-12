import { ConnectMongoDb } from "@/lib/dbconfig";
import SponsorModel from "@/models/sponsor";
import { NextRequest, NextResponse } from "next/server";
import "@/models/donation";
import { removeEmptyKeys } from "@/lib";

 

ConnectMongoDb();
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("sponsor_search") || "";

  const regex = new RegExp(search, "i");

  const query = {
    $or: [
      { "name": regex },
      { "businessName": regex },
      { "businessDescription": regex },
      { community: regex },
    ],
  }
  const cleaned = removeEmptyKeys(query)

  const sponsors = await SponsorModel.find(cleaned)
    .populate({ path: "donations", })
    .limit(limit)
    .skip(skip)
    .lean()
    .sort({
      updatedAt: "desc",
    });

  const total = await SponsorModel.countDocuments(cleaned)

  return NextResponse.json({
    success: true,
    data: sponsors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
} 

export async function POST(request: NextRequest) {
  const formdata = await request.json();
  const created = await SponsorModel.create({ ...formdata });
  if (created)
    return NextResponse.json({ message: "Sponsor created", success: true });
  return NextResponse.json({
    message: "Create Sponsor failed",
    success: false,
  });
}

export async function PUT(request: NextRequest) {
  const formData = await request.json();
  const updated = await SponsorModel.updateOne(
    { _id: formData._id },
    {
      $set: {
        name: formData.name,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        phone: formData.phone,
        logo: formData.logo,
        badges: formData.badges,
        donations: formData.donations,
      },
    }
  );
  if (updated.acknowledged)
    return NextResponse.json({ message: "Updated", success: true });
  return NextResponse.json({ message: "Update failed", success: false });
}

export async function DELETE(request: NextRequest) {
  const { sponsorId } = await request.json();
  const deleted = await SponsorModel.deleteOne({ _id: sponsorId });
  if (deleted.acknowledged)
    return NextResponse.json({ message: "Deleted", success: true });
  return NextResponse.json({ message: "Delete failed", success: false });
}


