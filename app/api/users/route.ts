import { ConnectMongoDb } from "@/lib/dbconfig";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { QueryFilter } from "mongoose";
import { saveToArchive } from "../archives/helper";
import { logAction } from "../logs/helper";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("user_search") || "";
  const role = searchParams.get("role") || "";
  const account = searchParams.get("account") || "";

  const regex = new RegExp(search, "i");

  const query: QueryFilter<string> = {
    $or: [
      { "name": regex },
      { "email": regex },
      { "role": regex },
    ],
  }

  if (role) query['role'] = role;
  if (account) query['account'] = account;

  const cleaned = removeEmptyKeys(query)

  const users = await UserModel.find(cleaned)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await UserModel.countDocuments(cleaned)

  return NextResponse.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });

}

export async function POST(req: NextRequest) {
  try {
    const salt = await bcrypt.genSalt(10);

    const { email, password, image, name, role } = await req.json();
    const hashedPass = await bcrypt.hash(password, salt);

    const alreadyExists = await UserModel.findOne({ email });
    if (alreadyExists)
      return NextResponse.json({
        success: false,
        message: `User with email ${email} already exists`,
      });

    const user = await UserModel.create({
      email,
      password: hashedPass,
      image,
      name, 
      role
    });

    // Log
    logAction({
      title: ` User [${name}] added.`,
      description: `User added - ${name}`,
    })
    return NextResponse.json({
      success: true,
      message: "New user created",
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: getErrorMessage(error, "Failed to create user"),
    });
  }
}