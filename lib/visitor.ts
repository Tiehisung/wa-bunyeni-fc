// lib/visitor.ts
import { cookies } from "next/headers";

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