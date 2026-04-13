// app/api/staff/role/[role]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import StaffModel from '@/models/staff';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';

connectDB();

// GET /api/staff/role/[role] - Get staff by role
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ role: string }> }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const staff = await StaffModel.find({ role: (await params).role })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await StaffModel.countDocuments({ role: (await params).role });

        return NextResponse.json({
            success: true,
            data: staff,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch staff by role', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch staff by role'),
        }, { status: 500 });
    }
}