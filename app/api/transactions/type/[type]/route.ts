// app/api/transactions/type/[type]/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import { getApiErrorMessage } from '@/lib/error-api';
import { TransactionModel } from '@/models/finance/transaction';
import { LoggerService } from '@/shared/log.service';
import connectDB from '@/config/db.config';
 

connectDB();

// GET /api/transactions/type/[type] - Get transactions by type
export async function GET(
    request: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { type } = params;
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        if (!['income', 'expense'].includes(type)) {
            return NextResponse.json({
                success: false,
                message: "Invalid transaction type. Must be 'income' or 'expense'",
            }, { status: 400 });
        }

        const transactions = await TransactionModel.find({ type })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await TransactionModel.countDocuments({ type });

        const totals = await TransactionModel.aggregate([
            { $match: { type } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    averageAmount: { $avg: '$amount' },
                    count: { $sum: 1 },
                },
            },
        ]);

        return NextResponse.json({
            success: true,
            data: {
                transactions,
                summary: {
                    totalAmount: totals[0]?.totalAmount || 0,
                    averageAmount: totals[0]?.averageAmount || 0,
                    totalCount: totals[0]?.count || 0,
                },
            },
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch transactions by type', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch transactions by type'),
        }, { status: 500 });
    }
}