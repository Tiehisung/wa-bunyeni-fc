import { auth } from "@/auth";
import { ConnectMongoDb } from "@/lib/dbconfig";
import ArchiveModel from "@/models/Archives";
import { IPostArchive } from "@/types/archive.interface";

ConnectMongoDb();

export async function saveToArchive({
    data, sourceCollection, reason, originalId
}: Omit<IPostArchive, "_id" | "createdAt">) {
    try {
        const session = await auth()
        const log = await ArchiveModel.create({
            data,
            sourceCollection,
            originalId,
            user: (session?.user),
            reason,
        });
        return log;
    } catch (error) {
        console.error("Failed to commit log:", error);
        return null;
    }
}
