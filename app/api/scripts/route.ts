import { NextResponse } from "next/server";
import { migrateUsersToFans } from "./migrate-users-to-fans";

 
export async function GET() {
  try {
    // Run migration
    const fans = await migrateUsersToFans();

    return NextResponse.json({
      ok: true,
      message: "🎉 Migration complete!",
      fans,
    });
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }
}
