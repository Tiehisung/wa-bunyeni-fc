// app/api/news/category/[category]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';

import NewsModel from '@/models/news';

connectDB();
 

// GET /api/news/category/[category] - Get news by category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> }
) {
    try {
        const { category } = await params;
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const news = await NewsModel.find({ category, isPublished: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await NewsModel.countDocuments({ category, isPublished: true });

        return NextResponse.json({
            success: true,
            data: news,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch news by category', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch news by category'),
        }, { status: 500 });
    }
}