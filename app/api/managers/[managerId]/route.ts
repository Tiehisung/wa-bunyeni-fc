import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import ManagerModel from "@/models/manager";
import { NextRequest, NextResponse } from "next/server";
import { saveToArchive } from "../../archives/helper";
import { logAction } from "../../logs/helper";
import { EArchivesCollection } from "@/types/archive.interface";
import { ELogSeverity } from "@/types/log";
import { formatDate } from "@/lib/timeAndDate";

ConnectMongoDb();

// GET
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ managerId: string }> }
) {
  const manager = await ManagerModel.findById((await params).managerId);
  return NextResponse.json(manager);
}

// PUT
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ managerId: string }> }
) {
  try {
    const formData = await request.json();
    const updated = await ManagerModel.updateOne(
      {
        _id: (await params).managerId,
      },
      { $set: { ...formData } }
    );
    if (updated.acknowledged)
      return NextResponse.json({ message: "Updated", success: true });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}

// Delete manager
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ managerId: string }> }
) {
  try {

    const managerId = (await params).managerId;
    const deleted = await ManagerModel.findByIdAndDelete(managerId);

    saveToArchive({
      sourceCollection: EArchivesCollection.MANAGERS,
      originalId: deleted?._id,
      data: { ...deleted, isLatest: false },
    });

    await logAction({
      title: `Manager deleted - [${deleted?.fullname}]`,
      description: `Manager (${deleted?.fullname}) deleted on ${formatDate(new Date().toISOString()) ?? ''}.`,
      severity: ELogSeverity.CRITICAL,
      meta: deleted?.toString(),
    });
    return NextResponse.json({ message: "Staff deleted", success: true });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}
