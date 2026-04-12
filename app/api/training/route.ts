import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../logs/helper";
import TrainingSession from "@/models/training";
import { formatDate } from "@/lib/timeAndDate";
import { IPostTrainingSession } from "@/app/admin/training/attendance/AttendanceTable";
import { IUser } from "@/types/user";

ConnectMongoDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);


  const limit = Number.parseInt(searchParams.get("limit") || "20", 10);
  const skip = (page - 1) * limit;

  const search = searchParams.get("training_search") || "";

  const regex = new RegExp(search, "i");

  let query = {}

  if (search) query = {
    $or: [
      { "location": regex },
      { "date": regex },
      { "note": regex },
      { "attendance.attendedBy.name": regex },
    ],
  }

  const cleaned = removeEmptyKeys(query)

  const trainingSession = await TrainingSession.find(cleaned)
    .limit(limit).skip(skip)
    .lean().sort({ createdAt: "desc" });

  const total = await TrainingSession.countDocuments(cleaned)
  return NextResponse.json({
    success: true, data: trainingSession, pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {

    const { attendance, date, location, note, recordedBy } = await request.json() as IPostTrainingSession;

    const savedSession = await TrainingSession.create({
      attendance, date, location, note, recordedBy
    });

    if (!savedSession) {
      return NextResponse.json({ message: "Failed to record session.", success: false });
    }



    // log
    await logAction({
      title: "Training session recorded",
      description: `A new training session recorded. on ${formatDate(new Date().toISOString()) ?? ''}.`,
    

    });
    return NextResponse.json({ message: "Session recorded successfully!", success: true, data: savedSession });

  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}
