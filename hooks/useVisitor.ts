"use client";

import { useEffect, useState } from "react";

export function useVisitor() {
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const initVisitor = async () => {
            try {
                const res = await fetch("/api/visitor", {
                    credentials: "include", // ensure cookie flow
                });

                const data = await res.json();

                if (mounted) {
                    setVisitorId(data.visitorId);
                }
            } catch (err) {
                console.error("Visitor init failed:", err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        initVisitor();

        return () => {
            mounted = false;
        };
    }, []);

    return { visitorId, isLoading };
}