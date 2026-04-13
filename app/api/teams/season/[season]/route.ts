// app/api/teams/season/[season]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import TeamModel from '@/models/teams';

connectDB();

// GET /api/teams/season/[season] - Get teams by season
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ season: string }> }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const teams = await TeamModel.find({ season: (await params).season })
            .skip(skip)
            .limit(limit)
            .lean()
            .sort({ name: 'asc' });

        const total = await TeamModel.countDocuments({ season: (await params).season });

        return NextResponse.json({
            success: true,
            data: teams,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch teams by season', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to retrieve teams by season'),
        }, { status: 500 });
    }
}