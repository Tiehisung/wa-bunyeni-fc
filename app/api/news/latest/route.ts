// app/api/news/latest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import NewsModel from '@/models/news';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';

connectDB();

// GET /api/news/latest - Get latest news
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');

        const news = await NewsModel.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: news,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch latest news', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch latest news'),
        }, { status: 500 });
    }
}