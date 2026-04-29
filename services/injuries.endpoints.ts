// injury.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IInjury } from "@/types/injury.interface";

const injuryApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all injuries
        getInjuries: builder.query<IQueryResponse<IInjury[]>, string>({
            query: (queryString = "") => `/injuries?${queryString}`,
            providesTags: ["Injuries"],
        }),

        // GET injury by ID
        getInjuryById: builder.query<IQueryResponse<IInjury>, string>({
            query: (id) => `/injuries/${id}`,
            providesTags: ["Injuries"],
        }),

        // GET injuries by player
        getInjuriesByPlayer: builder.query<IQueryResponse<IInjury[]>, string>({
            query: (playerId) => `/injuries/player/${playerId}`,
            providesTags: ["Injuries"],
        }),

        // GET injuries by match
        getInjuriesByMatch: builder.query<IQueryResponse<IInjury[]>, string>({
            query: (matchId) => `/injuries/match/${matchId}`,
            providesTags: ["Injuries"],
        }),

        // GET active injuries
        getActiveInjuries: builder.query<IQueryResponse<IInjury[]>, void>({
            query: () => "/injuries/active",
            providesTags: ["Injuries"],
        }),

        // GET injury statistics
        getInjuryStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/injuries/stats",
            providesTags: ["Injuries"],
        }),

        // CREATE injury
        createInjury: builder.mutation<IQueryResponse<IInjury>, Partial<IInjury>>({
            query: (body) => ({
                url: "/injuries",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Injuries"],
        }),

        // UPDATE injury
        updateInjury: builder.mutation<IQueryResponse<IInjury>, Partial<IInjury>>({
            query: ({ _id, ...body }) => ({
                url: `/injuries/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Injuries"],
        }),

        // UPDATE injury status
        updateInjuryStatus: builder.mutation<IQueryResponse<IInjury>, {
            id: string;
            status: 'active' | 'recovering' | 'returned' | 'season-ending';
            expectedReturnDate?: string;
            notes?: string;
        }>({
            query: ({ id, status, expectedReturnDate, notes }) => ({
                url: `/injuries/${id}/status`,
                method: "PATCH",
                body: { status, expectedReturnDate, notes },
            }),
            invalidatesTags: ["Injuries"],
        }),

        // DELETE injury
        deleteInjury: builder.mutation<IQueryResponse<IInjury>, string>({
            query: (id) => ({
                url: `/injuries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Injuries"],
        }),

    }),
});

export const {
    useGetInjuriesQuery,
    useGetInjuryByIdQuery,
    useGetInjuriesByPlayerQuery,
    useGetInjuriesByMatchQuery,
    useGetActiveInjuriesQuery,
    useGetInjuryStatsQuery,
    useCreateInjuryMutation,
    useUpdateInjuryMutation,
    useUpdateInjuryStatusMutation,
    useDeleteInjuryMutation,
} = injuryApi;

export default injuryApi;