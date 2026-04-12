import { ConnectMongoDb } from "@/lib/dbconfig";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import { EArchivesCollection } from "@/types/archive.interface";
import { saveToArchive } from "../../archives/helper";
import { ELogSeverity } from "@/types/log";
import bcrypt from "bcryptjs";
import { slugIdFilters } from "@/lib/api";

ConnectMongoDb();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const slug = slugIdFilters((await params).userId)
  const users = await UserModel.findOne(slug);
  return NextResponse.json(users);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { password, ...data } = await req.json();
    const slug = slugIdFilters((await params).userId)
    const updated = await UserModel.findOneAndUpdate(slug, {
      $set: { ...data },
    });
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updated.password = hashedPassword;
      await updated.save();
    }
    return NextResponse.json({
      message: "User updated",
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update user",
      error: error,
    });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;
    const slug = slugIdFilters((await params).userId)
    const deleted = await UserModel.findOneAndDelete(slug);
    //Archive
    saveToArchive({
      data: deleted,
      originalId: userId,
      sourceCollection: EArchivesCollection.USERS,
      reason: 'Sanitizing...',
    })

    // Log
    logAction({
      title: ` User [${deleted?.name}] deleted.`,
      description: deleted?.name,
      meta: deleted?.toString(),
      severity: ELogSeverity.CRITICAL,
    })
    return NextResponse.json({
      message: "User deleted",
      success: true,
      data: deleted,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      success: false,
      message: "Failed to delete user",
      error: error,
    });
  }
}
