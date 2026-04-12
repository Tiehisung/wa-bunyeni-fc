import { auth } from "@/auth";
import { ConnectMongoDb } from "@/lib/dbconfig";
import LogModel from "@/models/logs";
import { ELogSeverity, ILog } from "@/types/log";

ConnectMongoDb();
export async function logAction({
    title,
    description,
    severity = ELogSeverity.INFO,
    meta = {},
}: Omit<ILog, "_id" | "createdAt">) {
    try {
        const session = await auth()
        const log = await LogModel.create({
            title,
            description,
            user: (session?.user),
            severity,
            meta,
            createdAt: new Date(),
        });
        return log;
    } catch (error) {
        console.error("Failed to commit log:", error);
        return null;
    }
}
