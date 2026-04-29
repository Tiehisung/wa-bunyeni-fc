// app/api/news/trending/route.ts
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import NewsModel from '@/models/news';

import { getApiErrorMessage } from '@/lib/error-api';

import connectDB from '@/config/db.config';
import { updateAllTrendingScores } from '../../cron/update-trending-news/calculator';
import { authorizeOrResponse } from '../../auth/authorization';
import { EUserRole } from '@/types/user';

connectDB();

// GET /api/news/trending - Get trending news
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');

        let trendingNews = await NewsModel.find({
            isPublished: true,
            'stats.trendingScore': { $gt: 0 }
        })
        
        if(trendingNews.length === 0) {
            // Fallback to latest news if no trending news is found
            trendingNews = await NewsModel.find({ isPublished: true })
                .sort({ createdAt: 'desc' })
                .limit(limit);
        }

        return NextResponse.json({
            success: true,
            data: trendingNews,
        });
    } catch (error) {
  
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch trending news'),
        }, { status: 500 });
    }
}


// Only admins can manually trigger
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        authorizeOrResponse(session?.user?.role, EUserRole.ADMIN);

        const count = await updateAllTrendingScores();

        return NextResponse.json({
            success: true,
            message: `Updated trending scores for ${count} news items`,
            count,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
       
        return NextResponse.json(
            { success: false, message: getApiErrorMessage(error) },
            { status: 500 }
        );
    }
}