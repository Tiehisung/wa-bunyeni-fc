// lib/transaction/helpers.ts
import connectDB from '@/config/db.config';
import { TransactionModel } from '@/models/finance/transaction';
import { ETransactionType, ITransaction } from '@/types/finance.interface';
import { QueryFilter } from 'mongoose';

export async function getTransactionsSummary(startDate: string, endDate: string) {
    await connectDB();

    const query: any = {};

    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    } else {
        // Default to today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.date = { $gte: today, $lt: tomorrow };
    }

    const transactions = await TransactionModel.find(query);

    const incomeByCategory: Record<string, number> = {};
    const expensesByCategory: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction: ITransaction) => {
        if (transaction.type === ETransactionType.INCOME) {
            totalIncome += transaction.amount;
            incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
        } else {
            totalExpenses += transaction.amount;
            expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        }
    });

    return {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        incomeByCategory,
        expensesByCategory,
        period: { startDate, endDate },
    };
}

export async function getClubTransactions(
    filters?: {
        category?: string;
        type?: ETransactionType;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        skip?: number;
    }
) {
    await connectDB();

    const query: any = {};

    if (filters?.category) query.category = filters.category;
    if (filters?.type) query.type = filters.type;
    if (filters?.startDate || filters?.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = filters.startDate;
        if (filters.endDate) query.date.$lte = filters.endDate;
    }

    const skip = filters?.skip || 0;
    const limit = filters?.limit || 50;

    return TransactionModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);
}