import { getErrorMessage, removeEmptyKeys } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { TransactionModel } from "@/models/finance/transaction";
import { ITransaction, TransactionType } from "@/models/finance/types";
import { TSearchKey } from "@/types";
import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getClubTransactions, getFinancialSummary } from "..";
import { logAction } from "../../logs/helper";
import { IUser } from "@/types/user";

ConnectMongoDb();
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1", 10);

    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get("transaction_search") as TSearchKey || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const type = searchParams.get("type") as TransactionType || "";
    const category = searchParams.get("category") || "";

    const regex = new RegExp(search, "i");

    const query = {} as FilterQuery<unknown>

    if (search) query.$or = [
        { description: regex },
        { notes: regex },
        { amount: regex },
    ]

    if (category) query.category = category
    if (type) query.type = type

    if (startDate || endDate) {
        if (startDate) query['date.$gte'] = startDate
        if (endDate) query['date.$lte'] = endDate
    }

    const cleanedQuery = removeEmptyKeys(query)

    const transactions = await TransactionModel.find(cleanedQuery).sort({ date: -1 })
        .limit(limit).skip(skip)
        .lean();

    const summary = await getFinancialSummary(startDate, endDate)
    const trans = await getClubTransactions({ ...cleanedQuery })

    const total = await TransactionModel.countDocuments(cleanedQuery)

    return NextResponse.json({
        success: true,
        data: { transactions, finanacialSummary: summary, trans },
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        const { type, category, notes, description, amount, date, attachmentUrl, user } = (await request.json()) as ITransaction & { user: IUser }

        //Update Player
        const savedTransaction = await TransactionModel.create({ type, category, notes, description, amount, date, attachmentUrl })

        // log
        await logAction({
            title: "Transaction Created",
            description,
            category: "db",
            severity: "info",
            meta: { notes: notes ?? '' },
            user
        });

        return NextResponse.json({
            message: "Transaction created successfully!",
            success: true,
            data: savedTransaction
        });

    } catch (error) {
        return NextResponse.json({
            message: getErrorMessage(error),
            success: false,
        });
    }
}
