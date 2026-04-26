// app/api/injuries/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import InjuryModel from '@/models/injury';
import PlayerModel from '@/models/player';
import MatchModel from '@/models/match';
import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { logAction } from '../../logs/helper';

connectDB();

// GET /api/injuries/[id] - Get single injury
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const injury = await InjuryModel.findById(id).lean();

        if (!injury) {
            return NextResponse.json({
                success: false,
                message: 'Injury not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: injury,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch injury', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch injury'),
        }, { status: 500 });
    }
}

// PUT /api/injuries/[id] - Update injury
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

        const updatedInjury = await InjuryModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...updates,
                    updatedAt: new Date(),
                    updatedBy: session.user?._id,
                },
            },
            { runValidators: true }
        );

        if (!updatedInjury) {
            return NextResponse.json({
                success: false,
                message: 'Injury not found',
            }, { status: 404 });
        }

        await logAction({
            title: `Injury Updated - ${updatedInjury.title}`,
            description: 'Injury record updated',
            severity: ELogSeverity.INFO,
            meta: {
                injuryId: id,
                updates: Object.keys(updates),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Injury updated successfully',
            data: updatedInjury,
        });
    } catch (error) {
        LoggerService.error('Failed to update injury', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update injury'),
        }, { status: 500 });
    }
}

// DELETE /api/injuries/[id] - Delete injury
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

        const injuryToDelete = await InjuryModel.findById(id);

        if (!injuryToDelete) {
            return NextResponse.json({
                success: false,
                message: 'Injury not found',
            }, { status: 404 });
        }

        const deletedInjury = await InjuryModel.findByIdAndDelete(id);

        // Update Player - remove injury reference
        await PlayerModel.findByIdAndUpdate(
            injuryToDelete.player,
            { $pull: { injuries: id } }
        );

        // Update Match - remove injury reference
        if (injuryToDelete.match) {
            await MatchModel.findByIdAndUpdate(
                injuryToDelete.match,
                { $pull: { injuries: id } }
            );
        }

        await logAction({
            title: `Injury Deleted - ${injuryToDelete.title}`,
            description: 'Injury record deleted',
            severity: ELogSeverity.CRITICAL,
            meta: {
                injuryId: id,
                playerId: injuryToDelete.player,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Injury deleted successfully',
            data: deletedInjury,
        });
    } catch (error) {
        LoggerService.error('Failed to delete injury', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to delete injury'),
        }, { status: 500 });
    }
}