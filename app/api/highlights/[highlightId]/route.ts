import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import '@/models/file'
import { saveToArchive } from "../../archives/helper";
import { logAction } from "../../logs/helper";
import { ELogSeverity } from "@/types/log";
import { EArchivesCollection } from "@/types/archive.interface";
import HighlightModel from "@/models/highlight";

ConnectMongoDb();

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ highlightId: string }> }
) {
  const gallery = await HighlightModel.findById((await params).highlightId)
    .sort({ createdAt: "desc" });
  return NextResponse.json(gallery);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ highlightId: string }> }) {
  try {
    const highlightId = (await params).highlightId;
    const deleted = await HighlightModel.findByIdAndDelete(highlightId);

    //Archive
    saveToArchive({
      data: deleted,
      originalId: highlightId,
      sourceCollection: EArchivesCollection.GALLERIES,
      reason: 'Sanitizing...',
    })

    // Log
    logAction({
      title: ` Highlight [${deleted?.name}] deleted.`,
      description: deleted?.name,
      meta: deleted?.toString(),
      severity: ELogSeverity.CRITICAL,
    })
    return NextResponse.json({ message: "Deleted", success: true, data: deleted });
  } catch {

    return NextResponse.json({ message: "Delete failed", success: false });
  }
}
