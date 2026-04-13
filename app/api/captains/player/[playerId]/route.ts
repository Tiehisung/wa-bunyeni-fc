// app/api/captains/player/[playerId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import CaptaincyModel from '@/models/captain';
import { getApiErrorMessage } from '@/lib/error-api';
connectDB()

export async function GET(
    request: NextRequest,
    { params }: { params:Promise< { playerId: string }> }
) {
    try {


        const captaincies = await CaptaincyModel.find({ 'player._id': (await params).playerId })
            .sort({ startDate: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: captaincies,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch player captaincy history'),
        }, { status: 500 });
    }
}