import { ConnectMongoDb } from "@/lib/dbconfig";
import MatchModel from "@/models/match";
import MVPModel from "@/models/mpv";
import PlayerModel from "@/models/player";
import { NextRequest, NextResponse } from "next/server";

ConnectMongoDb();

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    const fixtures = await MVPModel.findById(id).lean()

    return NextResponse.json(fixtures);
}

export async function PUT(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {

    const mvpId = (await params).id

    const body = await request.json();

    const previousMvpData = await MVPModel.findById(mvpId)

    //disband previous player

    await PlayerModel.findByIdAndUpdate(previousMvpData?.player?._id, { $pull: { mvps: mvpId } });

    //Update mvp
    const updated = await MVPModel.findByIdAndUpdate(mvpId, {
        $set: { ...body },
        new: true
    });

    if (updated) {
        await MatchModel.findByIdAndUpdate(body?.match?._id ?? updated?.match?._id, { $set: { mvp: updated } });
        return NextResponse.json({ message: "Updated", success: true });
    }
    return NextResponse.json({ message: "Update failed", success: false });
}

export async function DELETE(_: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {

    const mvpId = (await params).id


    const deleted = await MVPModel.findByIdAndDelete(mvpId);

    await PlayerModel.findByIdAndUpdate(deleted?.player?._id, { $pull: { mvps: mvpId } });
    await MatchModel.findByIdAndUpdate(deleted?.match?._id, { $set: { mvp: null } });

    if (deleted)
        return NextResponse.json({ message: "Deleted", success: true, data: deleted });
    return NextResponse.json({ message: "Delete failed", success: false });
}
