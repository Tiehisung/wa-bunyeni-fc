import { createGallery } from "@/app/api/galleries/helper";
import { removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import DonationModel from "@/models/donation";
import SponsorModel from "@/models/sponsor";
import { NextRequest, NextResponse } from "next/server";
 

ConnectMongoDb();

export async function GET(request: NextRequest, { params }: { params: Promise<{ sponsorId: string }> }) {
  const sponsorId = (await params).sponsorId
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);


  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("donation_search") || "";

  const regex = new RegExp(search, "i");

  let query = {}

  if (search) query = {
    $or: [
      { "item": regex },
      { "description": regex },
      { "date": regex },
    ],
    //  sponsor: new mongoose.Types.ObjectId(sponsorId)
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
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sponsorId: string }> }
) {
  const sponsorId = (await params).sponsorId;
  const { item, description, files, date } = await request.json();

  const donated = await DonationModel.create({
    item,
    description,
    files,
    date,
    sponsor: sponsorId,
  });

  await SponsorModel.findByIdAndUpdate(sponsorId, {
    $push: { donations: donated._id },
    $inc: { badge: 1 }
  });

  //Update gallery
  if (files?.length > 0) {
    const sponsor = await SponsorModel.findById(sponsorId)
    createGallery({ title: item, description, files, tags: [sponsor.name ?? ''].filter(Boolean) })
  }

  return NextResponse.json({
    message: "Donated successfully",
    success: true,
    data: donated,
  });
}

//Revoke donation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sponsorId: string }> }
) {
  const sponsorId = (await params).sponsorId;
  const donationId = await request.json();
  await DonationModel.findByIdAndDelete(donationId);
  await SponsorModel.findByIdAndUpdate(sponsorId, {
    $pull: { donations: donationId },
  });

  return NextResponse.json({ message: "Donation revoked.", success: true });
}
