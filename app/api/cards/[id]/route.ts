import { ConnectMongoDb } from "@/lib/dbconfig";
import CardModel from "@/models/card";
import { NextRequest, NextResponse } from "next/server";

ConnectMongoDb();

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    const fixtures = await CardModel.findById(id).lean()

    return NextResponse.json(fixtures);
}
export async function PUT(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {

    const id = (await params).id

    const body = await request.json();

    const updated = await CardModel.findByIdAndUpdate(id, {
        $set: { ...body },
    });
    if (updated) return NextResponse.json({ message: "Updated", success: true });
    return NextResponse.json({ message: "Update failed", success: false });
}

export async function DELETE(_: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const deleted = await CardModel.findByIdAndDelete(id);
    if (deleted)
        return NextResponse.json({ message: "Deleted", success: true, data: deleted });
    return NextResponse.json({ message: "Delete failed", success: false });
}
