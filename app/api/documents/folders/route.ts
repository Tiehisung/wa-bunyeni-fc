// app/api/documents/folders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import FolderModel from '@/models/folder';
import { removeEmptyKeys } from '@/lib';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/documents/folders - List all folders
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('folder_search') || '';
        const isDefault = searchParams.get('isDefault') === 'true';

        const skip = (page - 1) * limit;
        const regex = new RegExp(search, 'i');

        const query: Record<string, unknown> = {};
        if (search) {
            query.$or = [
                { name: regex },
                { description: regex },
            ];
        }

        if (isDefault) query.isDefault = true;

        const cleaned = removeEmptyKeys(query);

        const folders = await FolderModel.find(cleaned)
            .populate('documents')
            .populate('createdBy', 'name role')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const formatted = folders.map(f => ({
            ...f,
            docsCount: f.documents?.length || 0,
        }));

        const total = await FolderModel.countDocuments(cleaned);

        return NextResponse.json({
            success: true,
            data: formatted,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch folders', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch folders'),
        }, { status: 500 });
    }
}

// POST /api/documents/folders - Create new folder
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { name, description, isDefault } = await request.json();

        const existingFolder = await FolderModel.findOne({ name });
        if (existingFolder) {
            return NextResponse.json({
                success: false,
                message: 'Folder already exists',
            }, { status: 409 });
        }

        const folder = await FolderModel.create({
            name,
            description,
            isDefault,
            createdBy: session.user?.id
        });

        return NextResponse.json({
            success: true,
            message: 'Folder created successfully',
            data: folder,
        }, { status: 201 });
    } catch (error) {
        // LoggerService.error('Failed to create folder', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to create folder'),
        }, { status: 500 });
    }
}