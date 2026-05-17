// app/api/fans/user/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage } from "@/lib/error-api";
import UserModel from "@/models/user";
import  FanModel  from "@/models/fans";
import { slugIdFilters } from "@/lib/slug";
import dbConnect from "@/config/db.config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();
    
    const { slug } = await params;
    const filter = slugIdFilters(slug);
    const user = await UserModel.findOne(filter);

    const fan = await FanModel.findOne({ user: user._id })
      .populate("user", "name email avatar role ")
      .lean();

    if (!fan) {
      return NextResponse.json(
        { success: false, error: "Fan profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: fan,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getApiErrorMessage(error) },
      { status: 500 },
    );
  }
}
