// app/api/documents/[docId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import DocModel from '@/models/doc';
import FolderModel from '@/models/folder';
import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { deleteCldAssets } from '../../file/route';
import { logAction } from '../../logs/helper';

connectDB();

// GET /api/documents/[docId] - Get single document
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ docId: string }> }
) {
    try {
        const docId = (await params).docId
        const document = await DocModel.findById(docId)
            .populate('folder', 'name docsCount')
            .populate('createdBy', 'name role')
            .lean();

        if (!document) {
            return NextResponse.json({
                success: false,
                message: 'Document not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: document,
        });
    } catch (error) {
        // LoggerService.error('Failed to fetch document', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch document'),
        }, { status: 500 });
    }
}

// PUT /api/documents/[docId] - Update document
export async function PUT(
    request: NextRequest,
      { params }: { params: Promise<{ docId: string }> }
) {
    try {
        const docId = (await params).docId
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const updates = await request.json();

        const updatedDoc = await DocModel.findByIdAndUpdate(
            docId,
            {
                $set: {
                    ...updates,
                    updatedAt: new Date(),
                    updatedBy: session.user?._id
                }
            },
            { runValidators: true }
        );

        if (!updatedDoc) {
            return NextResponse.json({
                success: false,
                message: 'Document not found',
            }, { status: 404 });
        }

        // If folder changed, update folder associations
        if (updates.folder && updates.folder !== updatedDoc.folder) {
            await FolderModel.updateMany(
                { documents: docId },
                { $pull: { documents: docId } }
            );

            await FolderModel.findOneAndUpdate(
                { name: updates.folder },
                { $addToSet: { documents: docId } },
                { upsert: true }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Document updated successfully',
            data: updatedDoc,
        });
    } catch (error) {
        // LoggerService.error('Failed to update document', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to update document'),
        }, { status: 500 });
    }
}

// DELETE /api/documents/[docId] - Delete single document
export async function DELETE(
    request: NextRequest,
      { params }: { params: Promise<{ docId: string }> }
) {
    try {
        const docId = (await params).docId
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const documentFile = await DocModel.findById(docId).lean();

        if (!documentFile) {
            return NextResponse.json({
                success: false,
                message: 'Document not found',
            }, { status: 404 });
        }

        await deleteCldAssets([documentFile as any]);

        const deleteFromDb = await DocModel.findByIdAndDelete(docId);

        await FolderModel.updateMany(
            { documents: docId },
            { $pull: { documents: docId } }
        );

        await logAction({
            title: `Document deleted - ${documentFile?.name ?? documentFile?.original_filename}`,
            description: `${documentFile?.original_filename} deleted from ${documentFile?.folder}`,
            severity: ELogSeverity.CRITICAL,
            meta: { documentId: docId, folder: documentFile?.folder },
        });

        return NextResponse.json({
            message: 'Delete successful',
            success: true,
            data: deleteFromDb,
        });
    } catch (error) {
        // LoggerService.error('Failed to delete document', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to delete file'),
            success: false,
        }, { status: 500 });
    }
}