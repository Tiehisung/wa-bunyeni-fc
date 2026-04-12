import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../logs/helper";
import FeatureModel from "@/models/feature";
import { QueryFilter } from "mongoose";
import { ELogSeverity } from "@/types/log";


ConnectMongoDb();
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);

    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const featureName = searchParams.get("name") || "";

    const regex = new RegExp(search, "i");

    const query = {} as QueryFilter<unknown>

    if (search) query.$or = [{ "name": regex },]

    if (featureName) query.name = featureName

    const cleaned = removeEmptyKeys(query)

    const features = await FeatureModel.find(cleaned)
        .limit(limit).skip(skip)
        .lean().sort({ createdAt: "desc" });

    const total = await FeatureModel.countDocuments(cleaned)

    return NextResponse.json({
        success: true, data: features, pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const { name, data, } = await request.json();

        const exists = await FeatureModel.findOne({ name: new RegExp(name, 'i') })

        if (exists)
            return NextResponse.json({ message: "Feature already exists.", success: false });

        const savedFeature = await FeatureModel.create({
            name, data
        });

        // log
        await logAction({
            title: `Feature Created - ${name}`,
            description: `New data feature created  `,
            meta: data
        });
        return NextResponse.json({ message: "Feature created successfully!", success: true, data: savedFeature });

    } catch (error) {
        return NextResponse.json({
            message: getErrorMessage(error),
            success: false,
        });
    }
}

export async function PUT(request: NextRequest,) {
    const { _id, data } = await request.json()

    const updated = await FeatureModel.findByIdAndUpdate(_id, { $set: { data } })

    await logAction({
        title: "Feature Updated",
        description: JSON.stringify(data),
        meta: data
    });
    return NextResponse.json({
        success: true,
        data: updated,
        message: 'Feature Updated'
    });
}

export async function DELETE(request: NextRequest) {

    const { _id: featureId } = await request.json()


    const deleted = await FeatureModel.findByIdAndDelete(featureId)

    await logAction({
        title: "Feature deleted - " + deleted?.name,
        description: JSON.stringify(deleted),
        severity: ELogSeverity.CRITICAL, meta: deleted
    });
    return NextResponse.json({
        success: true,
        data: deleted,
        message: 'Feature Deleted'
    });
}