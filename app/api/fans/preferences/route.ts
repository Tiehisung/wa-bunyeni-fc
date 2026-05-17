// app/api/fans/preferences/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getApiErrorMessage } from "@/lib/error-api";
import  FanModel  from "@/models/fans";
import UserModel from "@/models/user";
import { slugIdFilters } from "@/lib/slug";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await UserModel.findOne(slugIdFilters(session?.user?.email as string));

    const { preferences } = await request.json();

    const updatedFan = await FanModel.findOneAndUpdate(
      { user: user?._id },
      { $set: { preferences } },
      { new: true },
    );

    if (!updatedFan) {
      return NextResponse.json(
        { success: false, error: "Fan profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedFan,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getApiErrorMessage(error) },
      { status: 500 },
    );
  }
}
