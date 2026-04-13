// app/api/transactions/category/[category]/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { getApiErrorMessage } from '@/lib/error-api';
import { TransactionModel } from '@/models/finance/transaction';
import { LoggerService } from '@/shared/log.service';
 

connectDB();

// GET /api/transactions/category/[category] - Get transactions by category
export async function GET(
    request: NextRequest,
    { params }: { params: { category: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { category } = params;
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const transactions = await TransactionModel.find({ category })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await TransactionModel.countDocuments({ category });

        return NextResponse.json({
            success: true,
            data: transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch transactions by category', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch transactions by category'),
        }, { status: 500 });
    }
}