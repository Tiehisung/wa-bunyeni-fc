import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import ArchiveModel from "@/models/Archives";
import SquadModel from "@/models/squad";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import { ELogSeverity } from "@/types/log";
import { EArchivesCollection } from "@/types/archive.interface";
import { formatDate } from "@/lib/timeAndDate";
import { saveToArchive } from "../../archives/helper";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

ConnectMongoDb();

// GET
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ squadId: string }> }
) {
  const squad = await SquadModel.findById((await params).squadId);
  if (!squad) {
    return NextResponse.json({ message: "Squad not found.", success: false });
  }
  return NextResponse.json({ success: true, data: squad });
}

// PUT
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ squadId: string }> }
) {
  try {
    const formData = await request.json();
    const updated = await SquadModel.updateOne(
      {
        _id: (await params).squadId,
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
  _: Request,
  { params }: { params: Promise<{ squadId: string }> }
) {
  try {
    const squad = await SquadModel.findByIdAndDelete((await params).squadId);


    //Archive
    saveToArchive({
      data: squad,
      originalId: (await params).squadId,
      sourceCollection: EArchivesCollection.SQUADS,
      reason: 'Sanitizing...',
    })

    // log
    await logAction({
      title: `Squad deleted - [${squad?.name}]`,
      description: `A squad(${squad?.name}) deleted. on ${formatDate(new Date().toISOString()) ?? ''}.`,
      severity: ELogSeverity.CRITICAL,
      meta: squad?.toString(),
    });
    return NextResponse.json({ message: "Squad deleted", success: true });
  } catch (error) {
    return NextResponse.json({
      message: getErrorMessage(error),
      success: false,
    });
  }
}
