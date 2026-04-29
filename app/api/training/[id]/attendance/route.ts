// app/api/training/[id]/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import TrainingSessionModel from '@/models/training';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// PATCH /api/training/[id]/attendance - Update attendance
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const id = (await params).id

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { attendance } = await request.json();

        if (!attendance || !Array.isArray(attendance)) {
            return NextResponse.json({
                success: false,
                message: 'Attendance array is required',
            }, { status: 400 });
        }

        const updated = await TrainingSessionModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    attendance,
                    updatedAt: new Date(),
                    updatedBy: session.user?._id,
                },
                $inc: { updateCount: 1 },
            },

        );

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Training session not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Attendance updated successfully',
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update attendance'),
        }, { status: 500 });
    }
}