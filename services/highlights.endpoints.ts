// services/highlights.endpoints.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import { IMatchHighlight } from "@/types/match.interface";

const highlightsApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get all highlights with optional pagination/filtering
        getHighlights: builder.query<IQueryResponse<IMatchHighlight[]>, string | void>({
            query: (queryString = "") => `/highlights?${queryString}`,
            providesTags: ["Highlights"],
        }),

        // Get single highlight by ID
        getHighlightById: builder.query<IQueryResponse<IMatchHighlight>, string>({
            query: (highlightId) => `/highlights/${highlightId}`,
            providesTags: ["Highlights"],
        }),

        // Get highlights by match ID
        getHighlightsByMatch: builder.query<IQueryResponse<IMatchHighlight[]>, { matchId: string; queryString?: string }>({
            query: ({ matchId, queryString = "" }) => `/highlights/match/${matchId}${queryString}`,
            providesTags: ["Highlights"],
        }),

        // Create new highlight
        createHighlight: builder.mutation<IQueryResponse<IMatchHighlight>, Partial<IMatchHighlight>>({
            query: (body) => ({
                url: "/highlights",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Highlights"],
        }),

        // Update entire highlight
        updateHighlight: builder.mutation<IQueryResponse<IMatchHighlight>, Partial<IMatchHighlight>>({
            query: (body) => ({
                url: `/highlights/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Highlights"],
        }),

        // Partial update of highlight
        patchHighlight: builder.mutation<IQueryResponse<IMatchHighlight>, Partial<IMatchHighlight>>({
            query: (body) => ({
                url: `/highlights/${body._id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Highlights"],
        }),

        // Delete highlight
        deleteHighlight: builder.mutation<IQueryResponse<null>, string>({
            query: (highlightId) => ({
                url: `/highlights/${highlightId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Highlights"],
        }),

        // Get highlight statistics
        getHighlightStats: builder.query<IQueryResponse<{
            totalHighlights: number;
            totalViews: number;
            mostViewed: IMatchHighlight[];
            recentHighlights: IMatchHighlight[];
        }>, void>({
            query: () => "/highlights/stats",
            providesTags: ["Highlights"],
        }),

        // Increment view count for a highlight
        incrementHighlightView: builder.mutation<IQueryResponse<null>, string>({
            query: (highlightId) => ({
                url: `/highlights/${highlightId}/view`,
                method: "POST",
            }),
            invalidatesTags: ["Highlights"],
        }),
    }),
});

export const {
    // Query hooks
    useGetHighlightsQuery,
    useGetHighlightByIdQuery,
    useGetHighlightsByMatchQuery,
    useGetHighlightStatsQuery,

    // Mutation hooks
    useCreateHighlightMutation,
    useUpdateHighlightMutation,
    usePatchHighlightMutation,
    useDeleteHighlightMutation,
    useIncrementHighlightViewMutation,
} = highlightsApi;