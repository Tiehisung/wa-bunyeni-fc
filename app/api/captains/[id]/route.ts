import { auth } from "@/auth";

import CaptaincyModel from "@/models/captain";
import { ELogSeverity } from "@/types/log.interface";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../logs/helper";
import connectDB from "@/config/db.config";
import { getApiErrorMessage } from "../../../../lib/error-api";


connectDB();

// GET /api/captains/[id] - Get single captaincy record
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        const captaincy = await CaptaincyModel.findById(id).lean();

        if (!captaincy) {
            return NextResponse.json({
                success: false,
                message: 'Captaincy record not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: captaincy,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch captaincy record'),
        }, { status: 500 });
    }
}

// PUT /api/captains/[id] - Update captaincy record
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id


        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const updates = await request.json();
        delete updates._id;

        const updated = await CaptaincyModel.findByIdAndUpdate(
            id,
            { $set: updates },
        ).populate('player', 'name firstName lastName number position avatar');

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Captaincy record not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Captaincy record updated',
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update captaincy record'),
        }, { status: 500 });
    }
}

// DELETE /api/captains/[id] - Delete captaincy record
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id

        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const captaincy = await CaptaincyModel.findById(id);

        if (!captaincy) {
            return NextResponse.json({
                success: false,
                message: 'Captaincy record not found',
            }, { status: 404 });
        }

        const deleted = await CaptaincyModel.findByIdAndDelete(id);

        await logAction({
            title: '👑 Captaincy Record Deleted',
            description: `${captaincy.player?.name}'s captaincy record deleted`,
            severity: ELogSeverity.CRITICAL,
            meta: {
                captaincyId: id,
                playerId: captaincy.player?._id,
                role: captaincy.role,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Captaincy record deleted',
            data: deleted,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to delete captaincy record'),
        }, { status: 500 });
    }
}