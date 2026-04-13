// app/api/documents/folders/[folderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import FolderModel from '@/models/folder';
import DocModel from '@/models/doc';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import { EUserRole } from '@/types/user';

connectDB();

// GET /api/documents/folders/[folderId] - Get single folder
export async function GET(
    request: NextRequest,
    { params }: { params: { folderId: string } }
) {
    try {
        const folder = await FolderModel.findById(params.folderId)
            .populate('documents')
            .populate('createdBy', 'name role')
            .lean();

        if (!folder) {
            return NextResponse.json({
                success: false,
                message: 'Folder not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: folder,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch folder', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch folder'),
        }, { status: 500 });
    }
}

// PUT /api/documents/folders/[folderId] - Update folder
export async function PUT(
    request: NextRequest,
    { params }: { params: { folderId: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const updates = await request.json();

        if (updates.name) {
            const existingFolder = await FolderModel.findOne({ name: updates.name });
            if (existingFolder && existingFolder._id.toString() !== params.folderId) {
                return NextResponse.json({
                    success: false,
                    message: 'Folder already exists',
                }, { status: 409 });
            }
        }

        const folder = await FolderModel.findByIdAndUpdate(
            params.folderId,
            {
                $set: {
                    ...updates,
                    updatedAt: new Date(),
                    updatedBy: session.user?.id
                }
            },
            { new: true }
        );

        if (!folder) {
            return NextResponse.json({
                success: false,
                message: 'Folder not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Folder updated successfully',
            data: folder,
        });
    } catch (error) {
        // LoggerService.error('Failed to update folder', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update folder'),
        }, { status: 500 });
    }
}

// DELETE /api/documents/folders/[folderId] - Delete folder
export async function DELETE(
    request: NextRequest,
    { params }: { params: { folderId: string } }
) {
    try {
        const session = await auth();

        if (session?.user?.role !== EUserRole.SUPER_ADMIN) {
            return NextResponse.json({
                message: 'Unauthorized. Only super admins can delete folders.',
                success: false,
            }, { status: 403 });
        }

        const folder = await FolderModel.findById(params.folderId);

        if (!folder) {
            return NextResponse.json({
                success: false,
                message: 'Folder not found',
            }, { status: 404 });
        }

        await FolderModel.findByIdAndDelete(params.folderId);
        await DocModel.deleteMany({ folder: params.folderId });

        return NextResponse.json({
            success: true,
            message: 'Folder deleted successfully',
        });
    } catch (error) {
        // LoggerService.error('Failed to delete folder', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to delete folder'),
        }, { status: 500 });
    }
}