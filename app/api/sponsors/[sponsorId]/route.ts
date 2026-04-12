import { ConnectMongoDb } from "@/lib/dbconfig";
import SponsorModel from "@/models/sponsor";
import { NextRequest, NextResponse } from "next/server";
import "@/models/file";
import "@/models/donation";
import { logAction } from "../../logs/helper";
import { ELogSeverity } from "@/types/log";
import { formatDate } from "@/lib/timeAndDate";
import { saveToArchive } from "../../archives/helper";
import { EArchivesCollection } from "@/types/archive.interface";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";
ConnectMongoDb();
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ sponsorId: string }> }
) {
  const sponsor = await SponsorModel.findById((await params).sponsorId)

    .populate({ path: "donations", });
  return NextResponse.json(sponsor);
}
export async function DELETE(_: NextRequest,
  { params }: { params: Promise<{ sponsorId: string }> }) {
  try {
    const deleted = await SponsorModel.findByIdAndDelete((await params).sponsorId); // log
    //Archive
    saveToArchive({
      data: deleted,
      originalId: (await params).sponsorId,
      sourceCollection: EArchivesCollection.SPONSORS,
      reason: 'Sanitizing...',
    })

    await logAction({
      title: `Sponsor deleted - [${deleted?.name}]`,
      description: `A sponsor(${deleted?.name}) deleted. on ${formatDate(new Date().toISOString()) ?? ''}.`,
      severity: ELogSeverity.CRITICAL,
      meta: deleted?.toString(),
    });
    if (deleted)
      return NextResponse.json({ message: "Deleted", success: true });

  } catch (error) {
    return NextResponse.json({ message: "Delete failed", success: false, data: error });

  }
}
