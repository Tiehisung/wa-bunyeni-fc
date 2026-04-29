import { getApiErrorMessage } from "@/lib/error-api";
import { logAction } from "@/app/api/logs/helper";
import { auth } from "@/auth";
import connectDB from "@/config/db.config";
import CaptaincyModel from "@/models/captain";
import { ELogSeverity } from "@/types/log.interface";
import { NextRequest, NextResponse } from "next/server";

connectDB();
// PUT /api/captains/[id]/end - End a captain's tenure
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

        const { reason } = await request.json();

        const captaincy = await CaptaincyModel.findById(id);

        if (!captaincy) {
            return NextResponse.json({
                success: false,
                message: 'Captaincy record not found',
            }, { status: 404 });
        }

        if (!captaincy.isActive) {
            return NextResponse.json({
                success: false,
                message: 'This captaincy has already ended',
            }, { status: 400 });
        }

        const updated = await CaptaincyModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    isActive: false,
                    endDate: new Date(),
                    endReason: reason || 'End of tenure',
                },
            },
            { new: true }
        );

        await logAction({
            title: '👑 Captaincy Ended',
            description: `${captaincy.player?.name}'s tenure as ${captaincy.role} ended`,
            severity: ELogSeverity.INFO,
            meta: {
                captaincyId: id,
                playerId: captaincy.player?._id,
                role: captaincy.role,
                reason,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Captaincy ended successfully',
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to end captaincy'),
        }, { status: 500 });
    }
}