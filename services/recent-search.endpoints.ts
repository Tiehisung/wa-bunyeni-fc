// services/recent-search.endpoints.ts
import { IRecentSearch } from "@/store/slices/recentSearch.slice";
import { api } from "./api";

 
export const recentSearchApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Sync local searches with backend (optional)
        syncRecentSearches: builder.mutation<void, IRecentSearch[]>({
            query: (searches) => ({
                url: "/recent-searches/sync",
                method: "POST",
                body: { searches },
            }),
        }),
    }),
});

export const { useSyncRecentSearchesMutation } = recentSearchApi;