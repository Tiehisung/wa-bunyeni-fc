// services/search.endpoints.ts
import { api } from "./api";

export interface SearchResult {
    type: string;
    id: string;
    title: string;
    description?: string;
    image?: string;
    url: string;
    date?: string;
    relevance: number;
    metadata?: any;
}

interface SearchParams {
    q: string;
    types?: string;
    limit?: number;
    page?: number;
    fromDate?: string;
    toDate?: string;
}

interface QuickSearchResult {
    type: string;
    label: string;
    value: string;
    url: string;
    image?: string;
    subtitle?: string;
}

const searchApi = api.injectEndpoints({
    endpoints: (builder) => ({
        globalSearch: builder.query<{
            success: boolean;
            data: SearchResult[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
            searchTerm: string;
        }, SearchParams>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                searchParams.append("q", params.q);
                if (params.types) searchParams.append("types", params.types);
                if (params.limit) searchParams.append("limit", params.limit.toString());
                if (params.page) searchParams.append("page", params.page.toString());
                if (params.fromDate) searchParams.append("fromDate", params.fromDate);
                if (params.toDate) searchParams.append("toDate", params.toDate);
                return `/search?${searchParams.toString()}`;
            },
            keepUnusedDataFor: 300, // Cache for 5 minutes
        }),

        quickSearch: builder.query<QuickSearchResult[], string>({
            query: (q) => `/search/quick?q=${encodeURIComponent(q)}`,
            keepUnusedDataFor: 60, // Cache for 1 minute
        }),
    }),
});

export const {
    useGlobalSearchQuery,
    useQuickSearchQuery,
    useLazyGlobalSearchQuery,
    useLazyQuickSearchQuery,
} = searchApi;