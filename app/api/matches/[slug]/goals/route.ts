// app/api/matches/[slug]/goals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import { auth } from '@/auth';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { slugIdFilters } from '@/lib/slug';
import MatchModel from '@/models/match';


connectDB();

// POST /api/matches/[slug]/goals - Add goal to match
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const slug = (await params).slug
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const filter = slugIdFilters( slug);
        const goalData = await request.json();

        const match = await MatchModel.findOne(filter);
        if (!match) {
            return NextResponse.json({
                success: false,
                message: 'Match not found',
            }, { status: 404 });
        }

        match.goals.push(goalData);
        await match.save();

        return NextResponse.json({
            success: true,
            message: 'Goal added successfully',
            data: match,
        });
    } catch (error) {
        // LoggerService.error('Failed to add goal', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to add goal'),
        }, { status: 500 });
    }
}