// app/api/highlights/[highlightId]/view/route.ts
import { NextRequest, NextResponse } from 'next/server';

import HighlightModel from '@/models/highlight';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import { LoggerService } from '@/shared/log.service';

connectDB();

// POST /api/highlights/[highlightId]/view - Increment view count
export async function POST(
    request: NextRequest,
    { params }: { params: { highlightId: string } }
) {
    try {
        const updated = await HighlightModel.findByIdAndUpdate(
            params.highlightId,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({
                success: false,
                message: 'Highlight not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: { views: updated.views },
        });
    } catch (error) {
        LoggerService.error('Failed to update view count', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update view count'),
        }, { status: 500 });
    }
}