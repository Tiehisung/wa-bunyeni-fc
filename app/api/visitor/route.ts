// app/api/visitor/route.ts

import { getOrCreateVisitorId } from "@/lib/visitor";

export async function GET() {
    const visitorId = await getOrCreateVisitorId();
    return Response.json({ visitorId });
}


 