// app/api/training/[id]/note/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import TrainingSessionModel from '@/models/training';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// PATCH /api/training/[id]/note - Update session note
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { note } = await request.json();

        const updated = await TrainingSessionModel.findByIdAndUpdate(
            (await params).id,
            {
                $set: {
                    note,
                    updatedAt: new Date(),
                    updatedBy: session.user?.id,
                },
                $inc: { updateCount: 1 },
            },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Training session not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Note updated successfully',
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update note'),
        }, { status: 500 });
    }
}