// app/api/galleries/tag/[tag]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import GalleryModel from '@/models/galleries';


connectDB();

// GET /api/galleries/tag/[tag] - Get galleries by tag
export async function GET(
    request: NextRequest,
    { params }: { params: { tag: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const galleries = await GalleryModel.find({ tags: params.tag })
            .populate('files')
            .populate('createdBy', 'name role')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await GalleryModel.countDocuments({ tags: params.tag });

        return NextResponse.json({
            success: true,
            data: galleries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch galleries by tag', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch galleries by tag'),
        }, { status: 500 });
    }
}