// app/api/transactions/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import { getApiErrorMessage } from '@/lib/error-api';
import { TransactionModel } from '@/models/finance/transaction';
import { LoggerService } from '@/shared/log.service';
import connectDB from '@/config/db.config';
 

connectDB();

// GET /api/transactions/export - Export transactions
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const startDate = searchParams.get('startDate') || '';
        const endDate = searchParams.get('endDate') || '';
        const type = searchParams.get('type') || '';
        const category = searchParams.get('category') || '';
        const format = searchParams.get('format') || 'json';

        const query: any = {};

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (type) query.type = type;
        if (category) query.category = category;

        const transactions = await TransactionModel.find(query)
            .sort({ date: -1 })
            .lean();

        if (format === 'csv') {
            const headers = 'Date,Type,Category,Description,Amount,Notes\n';
            const csvRows = transactions.map(t =>
                `${t.date},${t.type},${t.category},${t.description},${t.amount},${t.notes || ''}`
            );
            const csv = headers + csvRows.join('\n');

            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename=transactions.csv',
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: transactions,
        });
    } catch (error) {
        LoggerService.error('Failed to export transactions', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to export transactions'),
        }, { status: 500 });
    }
}