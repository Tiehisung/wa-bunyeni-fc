import { deleteEmptyKeys, getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel from "@/models/match";
import { NextRequest, NextResponse } from "next/server";
import "@/models/teams";
import "@/models/file";
import "@/models/goals";
import "@/models/player";

ConnectMongoDb();
// export const revalidate = 0;
// export const dynamic = "force-dynamic";

//Post new fixture
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const sort = searchParams.get('sort') == 'asc' ? 'asc' : "desc";
    const status = searchParams.get('status') || "";
    const isHome = searchParams.get('isHome') || "";

    const filters = {
      status,
      isHome
    };

    const cleaned = deleteEmptyKeys(filters);
    console.log({ cleaned })

    const fixtures = await MatchModel.find(cleaned)
      .populate({ path: "opponent", populate: { path: "logo" } })
      .populate({ path: "goals", })
      .sort({
        createdAt: sort,
      });
    return NextResponse.json({ data: fixtures });
  } catch (error) {
    console.log(getErrorMessage(error).length);
    console.log({ error })
    return NextResponse.json(null);
  }
}
