// app/api/sponsors/top/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import SponsorModel from '@/models/sponsor';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/sponsors/top - Get top sponsors
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '5');

        const sponsors = await SponsorModel.find({ isActive: true })
            .populate('createdBy', 'name role')
            .sort({ badge: -1, totalDonations: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: sponsors,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch top sponsors'),
        }, { status: 500 });
    }
}