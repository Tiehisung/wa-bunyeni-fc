import { apiConfig } from "@/lib/configs";
import { ConnectMongoDb } from "@/lib/dbconfig";
import {  IQueryResponse, } from "@/types";
import { IGallery } from "@/types/file.interface";


export async function createGallery({
    title,
    description,
    files, tags,
}: IGalleryProps) {
    try {
        ConnectMongoDb();
        const response = await fetch(apiConfig.galleries, {
            method: 'POST', body: JSON.stringify({
                title,
                description,
                files, tags,
            }), headers: { 'content-type': 'application/json' }
        })
        const result: IQueryResponse = await response.json()

        return result;
    } catch {

        // optionally log this to an external monitoring tool (Sentry, etc.)
        return { message: 'Failed to create gallery', success: false };
    }
}
