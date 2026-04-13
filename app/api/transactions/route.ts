// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/config/db.config';
import { removeEmptyKeys } from '@/lib';
import { getApiErrorMessage } from '@/lib/error-api';
import { TransactionModel } from '@/models/finance/transaction';
import { LoggerService } from '@/shared/log.service';
import { getTransactionsSummary, getClubTransactions } from './helpers';
import { ETransactionType } from '@/types/finance.interface';

connectDB();

// GET /api/transactions - List all transactions
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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const search = searchParams.get('transaction_search') || '';
        const startDate = searchParams.get('startDate') || '';
        const endDate = searchParams.get('endDate') || '';
        const type = searchParams.get('type') as ETransactionType || '';
        const category = searchParams.get('category') || '';
        const minAmount = searchParams.get('minAmount') ? Number(searchParams.get('minAmount')) : undefined;
        const maxAmount = searchParams.get('maxAmount') ? Number(searchParams.get('maxAmount')) : undefined;

        const regex = new RegExp(search, 'i');
        const query: any = {};

        if (search) {
            query.$or = [
                { description: regex },
                { notes: regex },
                { category: regex },
                { reference: regex },
            ];
        }

        if (category) query.category = category;
        if (type) query.type = type;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (minAmount !== undefined || maxAmount !== undefined) {
            query.amount = {};
            if (minAmount !== undefined) query.amount.$gte = minAmount;
            if (maxAmount !== undefined) query.amount.$lte = maxAmount;
        }

        const cleanedQuery = removeEmptyKeys(query);

        const transactions = await TransactionModel.find(cleanedQuery)
            .sort({ date: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        const summary = await getTransactionsSummary(startDate, endDate);
        const clubTrans = await getClubTransactions(cleanedQuery);

        const total = await TransactionModel.countDocuments(cleanedQuery);

        return NextResponse.json({
            success: true,
            data: {
                transactions,
                financialSummary: summary,
                clubTransactions: clubTrans,
            },
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        LoggerService.error('Failed to fetch transactions', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch transactions'),
        }, { status: 500 });
    }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const { type, category, notes, description, amount, date, attachmentUrl, reference } = await request.json();

        if (!type || !category || !amount || !description) {
            return NextResponse.json({
                success: false,
                message: 'Type, category, amount, and description are required',
            }, { status: 400 });
        }

        if (amount <= 0) {
            return NextResponse.json({
                success: false,
                message: 'Amount must be greater than zero',
            }, { status: 400 });
        }

        const savedTransaction = await TransactionModel.create({
            type,
            category,
            notes,
            description,
            amount,
            date: date || new Date(),
            attachmentUrl,
            reference: reference || `TRX-${Date.now()}`,
            createdBy: session.user?.id
        });

        LoggerService.info('💰 Transaction Created', `${type}: ${description} - ${amount}`, request);

        return NextResponse.json({
            message: 'Transaction created successfully!',
            success: true,
            data: savedTransaction,
        }, { status: 201 });
    } catch (error) {
        LoggerService.error('Failed to create transaction', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to create transaction'),
            success: false,
        }, { status: 500 });
    }
}