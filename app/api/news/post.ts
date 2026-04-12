import { INewsProps } from "@/types/news.interface";
import { slugify } from "@/lib";
import { ConnectMongoDb } from "@/lib/dbconfig";
import NewsModel from "@/models/news";

export async function postNews({ headline, metaDetails, type }: Partial<INewsProps>) {
    try {
        ConnectMongoDb();

        let body = {}

        switch (type) {
            case 'squad':
                body = { headline, metaDetails, type }
                break;
            case 'general':
                body = { headline, details: metaDetails, type }
                break;
            default:
                body = { headline, details: metaDetails, type }

        }
        const slug = slugify(headline?.text as string);

        const saved = await NewsModel.create({
            ...body, slug
        });

        return saved;
    } catch {

        // optionally log this to an external monitoring tool (Sentry, etc.)
        return null;
    }
}
