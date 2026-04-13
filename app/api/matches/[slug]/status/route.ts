// app/api/matches/[slug]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import { EMatchStatus } from '@/types/match.interface';
import MatchModel from '@/models/match';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// PATCH /api/matches/[slug]/status - Update match status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { status } = await request.json();

        if (!Object.values(EMatchStatus).includes(status)) {
            return NextResponse.json({
                success: false,
                message: 'Invalid status value',
            }, { status: 400 });
        }

        const updated = await MatchModel.findOneAndUpdate(
            { slug: params.slug },
            { $set: { status, updatedAt: new Date() } },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({
                message: 'Match not found',
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Match status updated successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        // LoggerService.error('Failed to update match status', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to update match status'),
            success: false,
        }, { status: 500 });
    }
}