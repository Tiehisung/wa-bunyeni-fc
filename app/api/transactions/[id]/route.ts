// app/api/transactions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
 
import { auth } from '@/auth';
import { TransactionModel } from '@/models/finance/transaction';
import { LoggerService } from '@/shared/log.service';
import { getApiErrorMessage } from '@/lib/error-api';
import connectDB from '@/config/db.config';
 

connectDB();

// GET /api/transactions/[id] - Get single transaction
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id =(await params).id
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const transaction = await TransactionModel.findById(id).lean();

        if (!transaction) {
            return NextResponse.json({
                success: false,
                message: 'Transaction not found',
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        LoggerService.error('Failed to fetch transaction', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Failed to fetch transaction'),
        }, { status: 500 });
    }
}

// PUT /api/transactions/[id] - Update transaction
export async function PUT(
    request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id =(await params).id
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const updates = await request.json();
        delete updates._id;

        const existingTransaction = await TransactionModel.findById(id);
        if (!existingTransaction) {
            return NextResponse.json({
                success: false,
                message: 'Transaction not found',
            }, { status: 404 });
        }

        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
            id,
            { $set: { ...updates, updatedAt: new Date() } },
            { new: true, runValidators: true }
        );

        LoggerService.info('💰 Transaction Updated', updates.description || existingTransaction.description, request);

        return NextResponse.json({
            message: 'Transaction updated successfully',
            success: true,
            data: updatedTransaction,
        });
    } catch (error) {
        LoggerService.error('Failed to update transaction', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to update transaction'),
            success: false,
        }, { status: 500 });
    }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
    request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id =(await params).id
        const session = await auth();

        if (!session || !['admin', 'super_admin'].includes(session.user?.role || '')) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized',
            }, { status: 401 });
        }

        const transaction = await TransactionModel.findById(id);
        if (!transaction) {
            return NextResponse.json({
                success: false,
                message: 'Transaction not found',
            }, { status: 404 });
        }

        const deleted = await TransactionModel.findByIdAndDelete(id);

        LoggerService.info('💰 Transaction Deleted', `Transaction ${transaction.description} deleted`, request);

        return NextResponse.json({
            message: 'Transaction deleted successfully',
            success: true,
            data: {
                id: deleted?._id,
                description: transaction.description,
            },
        });
    } catch (error) {
        LoggerService.error('Failed to delete transaction', error);
        return NextResponse.json({
            message: getApiErrorMessage(error, 'Failed to delete transaction'),
            success: false,
        }, { status: 500 });
    }
}