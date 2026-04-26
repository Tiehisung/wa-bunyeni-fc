// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import DocModel from '@/models/doc';
import FolderModel from '@/models/folder';
import { ELogSeverity } from '@/types/log.interface';
import { IDocFile } from '@/types/doc';
import { removeEmptyKeys } from '@/lib';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';
import { deleteCldAssets } from '../file/route';
import { logAction } from '../logs/helper';

connectDB();

// GET /api/documents - List all documents
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('doc_search') || '';
        const folder = searchParams.get('folder') || '';
        const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

        const skip = (page - 1) * limit;
        const regex = new RegExp(search, 'i');

        const query: any = {
            $or: [
                { original_filename: regex },
                { description: regex },
                { tags: regex },
            ],
        };

        if (folder) query.folder = folder;
        if (tags.length > 0) query.tags = { $in: tags };

        const cleaned = removeEmptyKeys(query);

        const documents = await DocModel.find(cleaned)
            .populate('folder')
            .populate('createdBy', 'name role')
            .sort({ updatedAt: -1 })
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
        // LoggerService.error('Failed to fetch documents', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch documents'),
        }, { status: 500 });
    }
}

// POST /api/documents - Create multiple documents
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { files, folderId } = await request.json();

        if (!Array.isArray(files) || files.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No documents provided for upload',
            }, { status: 400 });
        }

        let destinationFolderId = folderId;
        if (!folderId) {
            let othersFolder = await FolderModel.findOne({
                $or: [{ name: 'others' }, { name: 'Others' }],
            });

            if (!othersFolder) {
                othersFolder = await FolderModel.create({ name: 'others', isDefault: true });
            }

            destinationFolderId = othersFolder._id;
        }

        const createdDocs = [];
        for (const df of files) {
            const createdDoc = await DocModel.create({
                ...df,
                folder: destinationFolderId,
                createdBy: session.user?._id
            });

            await FolderModel.findByIdAndUpdate(
                destinationFolderId,
                { $addToSet: { documents: createdDoc._id } },
                { upsert: true }
            );

            createdDocs.push(createdDoc);
        }

        LoggerService.critical(
            `Document(s) uploaded to folder - ${destinationFolderId}`,
            `${createdDocs.length} document(s) uploaded`,
            request
        );

        return NextResponse.json({
            success: true,
            message: 'New Document(s) Uploaded',
            data: createdDocs,
        }, { status: 201 });
    } catch (error) {
        // LoggerService.error('Failed to upload documents', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to upload document'),
        }, { status: 500 });
    }
}

// DELETE /api/documents - Bulk delete documents
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const documents = await request.json() as IDocFile[];

        if (!Array.isArray(documents) || documents.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No documents provided for deletion',
            }, { status: 400 });
        }

        const results = [];
        const errors = [];

        for (const documentFile of documents) {
            try {
                await deleteCldAssets([{ ...documentFile }]);

                const deleteFromDb = await DocModel.findOneAndDelete({
                    _id: documentFile._id
                });

                if (deleteFromDb) {
                    await FolderModel.updateMany(
                        { documents: documentFile._id },
                        { $pull: { documents: documentFile._id } }
                    );
                    results.push(documentFile._id);
                }
            } catch (err) {
                errors.push({ id: documentFile._id, error: err });
            }
        }

        await logAction({
            title: `Documents deleted - ${results.length} files`,
            description: `${results.length} documents deleted, ${errors.length} failed`,
            severity: errors.length > 0 ? ELogSeverity.WARNING : ELogSeverity.INFO,
            meta: { successful: results, failed: errors },
        });

        return NextResponse.json({
            message: 'Delete operation completed',
            success: true,
            data: {
                deleted: results.length,
                failed: errors.length,
                errors: errors,
            },
        });
    } catch (error) {
        // LoggerService.error('Failed to delete documents', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to delete files'),
            success: false,
        }, { status: 500 });
    }
}