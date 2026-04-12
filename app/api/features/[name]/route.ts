
import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import { IUser } from "@/types/user";
import FeatureModel from "@/models/feature";
import { ELogSeverity } from "@/types/log";

ConnectMongoDb();
export async function GET(_: NextRequest, { params }: { params: Promise<{ name: string }> }) {

    const name = (await params).name

    const regex = new RegExp(name, "i");

    const features = await FeatureModel.findOne({ name: regex })

    return NextResponse.json(features);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    const name = (await params).name
    const { user, data } = await request.json()

    const updated = await FeatureModel.findOneAndUpdate({ name }, { $set: { data } })

    await logAction({
        title: "Feature Updated",
        description: `Feature updated by ${user?.name ?? 'Admin'}`,
    });
    return NextResponse.json({
        success: true,
        data: updated,
        message: 'Feature Updated'
    });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    const name = (await params).name
    const { user, } = await request.json()

    const updated = await FeatureModel.findOneAndDelete({ name })

    await logAction({
        title: "Feature deleted",
        description: `Feature deleted by ${user?.name ?? 'Admin'}`,
        severity:ELogSeverity.WARNING,
    });
    return NextResponse.json({
        success: true,
        data: updated,
        message: 'Feature Deleted'
    });
}