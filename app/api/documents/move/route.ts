// app/api/documents/move/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import DocModel from '@/models/doc';
import FolderModel from '@/models/folder';
import { ELogSeverity } from '@/types/log.interface';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';
import { logAction } from '../../logs/helper';

connectDB();

// PUT /api/documents/move - Move documents to another folder
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { fileIds, destinationFolderId } = await request.json();

        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No files provided',
            }, { status: 400 });
        }

        const results = [];

        for (const fileId of fileIds) {
            await DocModel.findByIdAndUpdate(fileId, {
                $set: { folder: destinationFolderId }
            });

            await FolderModel.updateMany(
                { documents: fileId },
                { $pull: { documents: fileId } }
            );

            await FolderModel.findByIdAndUpdate(
                destinationFolderId,
                { $addToSet: { documents: fileId } },
                { upsert: true }
            );

            results.push({ id: fileId, destination: destinationFolderId });
        }

        await logAction({
            title: `Documents moved operation`,
            description: `${results.length} documents processed`,
            severity: ELogSeverity.INFO,
            meta: { operations: results },
        });

        return NextResponse.json({
            success: true,
            message: `${fileIds.length} moved`,
            data: results,
        });
    } catch (error) {
        // LoggerService.error('Failed to move documents', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Operation failed'),
        }, { status: 500 });
    }
}