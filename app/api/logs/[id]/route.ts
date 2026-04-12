import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user";
import { ISession, IUser } from "@/types/user";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { getErrorMessage } from "@/lib";
import { auth } from "@/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";

ConnectMongoDb();
export interface SessionIUser {
  user: {
    name: string;
    image: string;
    role: IUser['role'];
    email: string;
  };
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const users = await UserModel.findById((await params).id);
  return NextResponse.json(users);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await auth())
    if ((session?.user as ISession['user'])?.role !== "super_admin")
      return NextResponse.json({
        success: false,
        message: "You are not authorized to perform this action.",
      });

    const data = await req.json();

    const updated = await UserModel.findByIdAndUpdate((await params).id, {
      $set: { ...data },
    });
    return NextResponse.json({
      message: "User updated",
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: getErrorMessage(error),
    });
  }
}

// Engage/Disengage manager
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await UserModel.findById((await params).id);
    admin.isActive = !admin.isActive;
    admin.save();

    return NextResponse.json({
      message: "User updated",
      success: true,
      data: admin,
    });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({
      success: false,
      message: "Failed to update user",
      error: error,
    });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = (await auth())
    if ((session?.user as ISession['user'])?.role !== "super_admin")
      return NextResponse.json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    const deleted = await UserModel.findByIdAndDelete((await params).id);

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
