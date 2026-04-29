// app/api/injuries/active/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';

import InjuryModel from '@/models/injury';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { LoggerService } from '../../../../shared/log.service';

connectDB();

// GET /api/injuries/active - Get active injuries
export async function GET(request: NextRequest) {
    try {
        const injuries = await InjuryModel.find({
            status: { $in: ['active', 'recovering'] }
        })
            .populate('player', 'name number position avatar')
            .populate('match', 'title date')
            .sort({ createdAt: 'desc' })
            .lean();

        return NextResponse.json({
            success: true,
            data: injuries,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch active injuries', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch active injuries'),
        }, { status: 500 });
    }
}