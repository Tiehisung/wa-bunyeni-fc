// app/api/news/trending/route.ts
import { NextRequest, NextResponse } from 'next/server';
import NewsModel from '@/models/news';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';

connectDB();

// GET /api/news/trending - Get trending news
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '5');

        const news = await NewsModel.find({ 'stats.isTrending': true, isPublished: true })
            .sort({ 'stats.viewCount': -1, createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            data: news,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch trending news', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch trending news'),
        }, { status: 500 });
    }
}