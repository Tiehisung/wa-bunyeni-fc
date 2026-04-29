// app/api/staff/active/route.ts
import { NextRequest, NextResponse } from 'next/server';
import StaffModel from '@/models/staff';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { LoggerService } from '../../../../shared/log.service';

connectDB();

// GET /api/staff/active - Get active staff
export async function GET(request: NextRequest) {
    try {
        const staff = await StaffModel.find({ isActive: true })
            .sort({ role: 1, fullname: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: staff,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch active staff', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch active staff'),
        }, { status: 500 });
    }
}