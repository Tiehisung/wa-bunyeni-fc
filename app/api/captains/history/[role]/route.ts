// app/api/captains/history/[role]/route.ts
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import CaptaincyModel from '@/models/captain';
import { NextRequest, NextResponse } from 'next/server';

connectDB();
// GET /api/captains/history/[role] - Get captaincy history by role
export async function GET(
    request: NextRequest,
    { params }: { params: { role: string } }
) {
    try {


        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const history = await CaptaincyModel.find({ role: params.role })
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await CaptaincyModel.countDocuments({ role: params.role });

        return NextResponse.json({
            success: true,
            data: history,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch captaincy history'),
        }, { status: 500 });
    }
}