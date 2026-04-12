import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import ManagerModel from "@/models/manager";
import { QueryFilter } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
 

ConnectMongoDb();
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  const limit = Number.parseInt(searchParams.get("limit") || "30", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("manager_search") || "";
  const isActive = searchParams.get("isActive") || "";

  const regex = new RegExp(search, "i");

  let query: QueryFilter<unknown> = {}

  if (isActive) query['isActive'] = true

  if (search) query = {
    $or: [
      { "fullname": regex },
      { "dob": regex },
      { "email": regex },
    ],

  }
  const cleaned = removeEmptyKeys(query)

  const managers = await ManagerModel.find(cleaned)
    .limit(limit).skip(skip)
    .lean();;

  const total = await ManagerModel.countDocuments(cleaned)
  return NextResponse.json({
    success: true, data: managers, pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });




}

export async function POST(request: NextRequest) {
  try {
    const { fullname, phone, email,   dateSigned, role, avatar } =
      await request.json();

    const exists = await ManagerModel.findOne({
      email: email.toLowerCase().trim(),
    });

    if (exists)
      return NextResponse.json({
        message: "Staff with " + email + " already exists",
        success: false,
      });

    //Disable previous role staff
    await ManagerModel.updateOne(
      { role: role, isActive: true },
      { $set: { isActive: false } }
    );

    //Save new staff
    const saved = await ManagerModel.create({
      fullname,
      phone,
      email,
      // dob,
      dateSigned,
      role,
      avatar,
      isActive: true,
    });
    if (saved)
      return NextResponse.json({ message: "Staff created", success: true });
    return NextResponse.json({
      message: "Failed to create staff",
      success: false,
    });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}
