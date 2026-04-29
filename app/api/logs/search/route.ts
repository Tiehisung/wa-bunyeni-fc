// app/api/logs/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import LogModel from '@/models/logs';
import { LoggerService } from '@/shared/log.service';
 

connectDB();

// GET /api/logs/search - Search logs
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin', 'coach', 'player'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const q = searchParams.get('q');
        const field = searchParams.get('field');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        if (!q) {
            return NextResponse.json({
                success: false,
                message: 'Search query is required',
            }, { status: 400 });
        }

        const searchRegex = new RegExp(q, 'i');
        let query: any = {};

        if (field) {
            query[field] = searchRegex;
        } else {
            query = {
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { category: searchRegex },
                    { severity: searchRegex },
                ]
            };
        }

        const logs = await LogModel.find(query)
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await LogModel.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to search logs', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to search logs'),
        }, { status: 500 });
    }
}