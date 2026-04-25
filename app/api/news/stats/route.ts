 
import connectDB from '@/config/db.config';
 
import { NextRequest, NextResponse } from 'next/server';
 
import NewsModel from '@/models/news';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
connectDB();
// app/api/news/stats/route.ts

 

// GET /api/news/stats - Get overall news statistics
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');

        const [totalNews, publishedNews, trendingNews, latestNews] = await Promise.all([
            NewsModel.countDocuments(),
            NewsModel.countDocuments({ isPublished: true }),
            NewsModel.find({ 'stats.isTrending': true, isPublished: true })
                .limit(limit)
                .lean(),
            NewsModel.find({ isPublished: true })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean(),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalNews,
                publishedNews,
                draftNews: totalNews - publishedNews,
                trendingNews,
                latestNews,
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch news statistics', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch news statistics'),
        }, { status: 500 });
    }
}