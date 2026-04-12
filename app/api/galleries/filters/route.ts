import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import GalleryModel from "@/models/galleries";
import { NextRequest, NextResponse } from "next/server";
import "@/models/file";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

ConnectMongoDb();
//Not in use
export async function POST(request: NextRequest) {
  try {
    const filters = await request.json();
    const saved = await GalleryModel.find(filters)
      .populate("files")
      .sort({ createdAt: "desc" });
    if (saved)
      return NextResponse.json({ message: "Gallery created", success: true });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error, "Failed to save gallery"),
      success: false,
    });
  }
}
