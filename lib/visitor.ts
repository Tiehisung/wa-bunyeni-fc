// lib/visitor.ts
import { cookies } from "next/headers";

/**
 * 
 * @returns Safe id for only server /api
 */
export async function getOrCreateVisitorId() {
    const cookieStore = cookies();

    let visitorId = (await cookieStore).get("visitorId")?.value;

    if (!visitorId) {
        visitorId = crypto.randomUUID();

        (await cookieStore).set("visitorId", visitorId, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });
    }

    return visitorId;
}

/**
 * 
 * @returns Safe for both client and server
 */
export async function getVisitorId() {
    return (await cookies()).get("visitorId")?.value || null;
}
