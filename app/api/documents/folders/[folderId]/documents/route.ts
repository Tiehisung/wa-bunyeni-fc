// app/api/documents/folders/[folderId]/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import DocModel from '@/models/doc';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { removeEmptyKeys } from '@/lib';

connectDB();

// GET /api/documents/folders/[folderId]/documents - Get documents in folder
export async function GET(
    request: NextRequest,
    { params }: { params: { folderId: string } }
) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('doc_search') || '';

        const skip = (page - 1) * limit;
        const regex = new RegExp(search, 'i');

        const query: any = {
            folder: params.folderId,
        };

        if (search) {
            query.$or = [
                { original_filename: regex },
                { description: regex },
                { tags: regex },
            ];
        }

        const cleaned = removeEmptyKeys(query);

        const documents = await DocModel.find(cleaned)
            .populate('folder')
            .populate('createdBy', 'name role')
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await DocModel.countDocuments(cleaned);

        return NextResponse.json({
            success: true,
            data: documents,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch folder documents', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch folder documents'),
        }, { status: 500 });
    }
}