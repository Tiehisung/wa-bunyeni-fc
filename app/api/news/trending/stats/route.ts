// app/api/news/trending/stats/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
import NewsModel from '@/models/news';

export async function GET() {
    await connectDB();
    try {
        const session = await auth();

        const count = await NewsModel.countDocuments({
            isPublished: true,
            'stats.trendingScore': { $gt: 0 }
        });

        const lastUpdated = await NewsModel.findOne(
            { 'stats.lastTrendingUpdate': { $exists: true } },
            { 'stats.lastTrendingUpdate': 1 }
        ).sort({ 'stats.lastTrendingUpdate': -1 });

        return NextResponse.json({
            success: true,
            count,
            lastUpdated: lastUpdated?.stats?.lastTrendingUpdate || null,
        });
    } catch (error:any) {
        return NextResponse.json(
            { success: false, message: getApiErrorMessage(error) },
            { status: 500 }
        );
    }
}