// app/api/matches/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import { ELogSeverity } from '@/types/log.interface';
import { EArchivesCollection } from '@/types/archive.interface';
import MatchModel from '@/models/match';

import { saveToArchive } from '../../archives/helper';
import { logAction } from '../../logs/helper';
import { formatDate } from '@/lib/timeAndDate';
import { slugIdFilters } from '../../../../lib/slug';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/matches/[slug] - Get single match by slug or ID
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const filter = slugIdFilters(params.slug);

        const match = await MatchModel.findOne(filter)
            .populate('opponent')
            .populate('goals')
            .populate('squad')
            .populate('cards')
            .populate('injuries')
            .populate('mvp');

        if (!match) {
            return NextResponse.json({
                success: false,
                message: 'Match not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: match,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch match'),
        }, { status: 500 });
    }
}

// PUT /api/matches/[slug] - Update match
export async function PUT(
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

        const filter = slugIdFilters(params.slug);
        const body = await request.json();
        delete body._id;

        const updated = await MatchModel.findOneAndUpdate(
            filter,
            { $set: { ...body, updatedAt: new Date() } },
            { new: true, runValidators: true }
        ).populate('opponent').populate('goals').populate('squad');

        if (!updated) {
            return NextResponse.json({
                message: 'Match not found',
                success: false,
            }, { status: 404 });
        }

        await logAction({
            title: `Match updated - [${updated.title}]`,
            description: `Match details updated on ${formatDate(new Date().toISOString())}`,
            severity: ELogSeverity.INFO,
            meta: {
                slug: updated._id,
                updates: Object.keys(body),
            },
        });

        return NextResponse.json({
            message: 'Match updated successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Update failed'),
            success: false,
        }, { status: 500 });
    }
}

// PATCH /api/matches/[slug] - Partial update match
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

        const filter = slugIdFilters(params.slug);
        const updates = await request.json();

        Object.keys(updates).forEach(key => {
            if (updates[key] === undefined || updates[key] === null) {
                delete updates[key];
            }
        });
        delete updates._id;

        const updated = await MatchModel.findOneAndUpdate(
            filter,
            { $set: { ...updates, updatedAt: new Date() } },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({
                message: 'Match not found',
                success: false,
            }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Match updated successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Update failed'),
            success: false,
        }, { status: 500 });
    }
}

// DELETE /api/matches/[slug] - Delete match
export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const filter = slugIdFilters(params.slug);
        const deleted = await MatchModel.findOneAndDelete(filter);

        if (!deleted) {
            return NextResponse.json({
                message: 'Match not found',
                success: false,
            }, { status: 404 });
        }

        await saveToArchive(deleted, EArchivesCollection.MATCHES, '', request);

        await logAction({
            title: `Match deleted - [${deleted.title}]`,
            description: `Match item (${deleted.title}) deleted on ${formatDate(new Date().toISOString())}.`,
            severity: ELogSeverity.CRITICAL,
            meta: {
                slug: deleted._id,
                title: deleted.title,
                date: deleted.date,
                opponent: deleted.opponent,
            },
        });

        return NextResponse.json({
            message: 'Match deleted successfully',
            success: true,
            data: { id: deleted._id, title: deleted.title },
        });
    } catch (error) {
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Delete failed'),
            success: false,
        }, { status: 500 });
    }
}
