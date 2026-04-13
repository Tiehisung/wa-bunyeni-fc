// app/api/captains/active/route.ts
import connectDB from '@/config/db.config';
import CaptaincyModel from '@/models/captain';
import { NextRequest, NextResponse } from 'next/server';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();
// GET /api/captains/active - Get all active captains
export async function GET(request: NextRequest) {
    try {
        const captains = await CaptaincyModel.find({ isActive: true })
            .sort({ role: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: captains,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch active captains'),
        }, { status: 500 });
    }
}