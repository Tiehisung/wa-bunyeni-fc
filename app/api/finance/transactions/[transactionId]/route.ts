import { getErrorMessage } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import { TransactionModel } from "@/models/finance/transaction";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "../../../logs/helper";

ConnectMongoDb();
export async function GET(_: NextRequest, { params }: { params: Promise<{ transactionId: string }> }) {

    const transaction = await TransactionModel.findById((await params).transactionId)

    return NextResponse.json({
        success: true,
        data: transaction
    });
}



export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ transactionId: string }> }
) {
    try {
        const transactionId = (await params).transactionId;
        const formData = await request.json();

        const updatedPlayer = await TransactionModel.findByIdAndUpdate(transactionId, {
            $set: { ...formData },
        });

        // log
        await logAction({
            title: "Transaction updated",
            description: formData?.description ?? '',
            category: "db",
            severity: "info",
            user: formData?.user
        });
        return NextResponse.json({
            message: "Transaction update success",
            success: true,
            data: updatedPlayer,
        });
    } catch (error) {
        return NextResponse.json({
            message: `Update failed. ${getErrorMessage(error)}`,
            success: false,
        });
    }
} export async function DELETE(_: NextRequest, { params }: { params: Promise<{ transactionId: string }> }) {
    try {
        const transactionId = (await params).transactionId;
        const deleted = await TransactionModel.findByIdAndDelete(transactionId);
        const body = await _.json()
        // log
        await logAction({
            title: "Transaction updated",
            description: `Transaction with id ${transactionId} was deleted`,
            category: "db",
            severity: "info",
            user: body?.user,
            meta: { deleted }
        });

        return NextResponse.json({ message: "Deleted", success: true, data: deleted });
    } catch {

        return NextResponse.json({ message: "Delete failed", success: false });
    }
}