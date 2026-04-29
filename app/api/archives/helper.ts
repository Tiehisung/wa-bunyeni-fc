import ArchiveModel from "@/models/Archives";
import { EArchivesCollection } from "@/types/archive.interface";
import { IUser } from "@/types/user";
 
 
export async function saveToArchive(
    doc: any, sourceCollection: EArchivesCollection, reason?: string, req?: Request, user?: IUser
) {
    try {
        const userData = user  
        // const session = await auth()
        const archive = await ArchiveModel.create({
            doc,
            sourceCollection,
            user: userData,
            reason,
        });
        return archive;
    } catch (error) {
        console.error("Failed to commit archive:", error);
        return null;
    }
}
