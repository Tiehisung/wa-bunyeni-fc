// captain.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ICaptain } from "@/types/player.interface";

const captainApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all captaincy records
        getCaptains: builder.query<IQueryResponse<ICaptain[]>, string>({
            query: (paramsString='') => `/captains?${paramsString}`,
            providesTags: ["Captains"],
        }),

        // GET active captains
        getActiveCaptains: builder.query<IQueryResponse<ICaptain[]>, void>({
            query: () => "/captains/active",
            providesTags: ["Captains"],
        }),

        // GET captaincy statistics
        getCaptaincyStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/captains/stats",
            providesTags: ["Captains"],
        }),

        // GET captaincy by player
        getCaptaincyByPlayer: builder.query<IQueryResponse<ICaptain[]>, string>({
            query: (playerId) => `/captains/player/${playerId}`,
            providesTags: ["Captains"],
        }),

        // GET captaincy history by role (club, national, tournament)
        getCaptaincyHistoryByRole: builder.query<IQueryResponse<ICaptain[]>, string>({
            query: (role) => `/captains/role/${role}`,
            providesTags: ["Captains"],
        }),

        // GET captaincy by ID
        getCaptaincyById: builder.query<IQueryResponse<ICaptain>, string>({
            query: (id) => `/captains/${id}`,
            providesTags: ["Captains"],
        }),

        // ASSIGN captain
        assignCaptain: builder.mutation<IQueryResponse<ICaptain>, Partial<ICaptain>>({
            query: (body) => ({
                url: "/captains",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Captains"],
        }),

        // ASSIGN multiple captains
        assignMultipleCaptains: builder.mutation<IQueryResponse<ICaptain[]>, { assignments: Partial<ICaptain>[] }>({
            query: ({ assignments }) => ({
                url: "/captains/bulk",
                method: "POST",
                body: { assignments },
            }),
            invalidatesTags: ["Captains"],
        }),

        // END captaincy
        endCaptaincy: builder.mutation<IQueryResponse<ICaptain>, {
            id: string;
            endDate: string;
            reason?: string;
        }>({
            query: ({ id, endDate, reason }) => ({
                url: `/captains/${id}/end`,
                method: "PATCH",
                body: { endDate, reason },
            }),
            invalidatesTags: ["Captains"],
        }),

        // UPDATE captaincy
        updateCaptaincy: builder.mutation<IQueryResponse<ICaptain>, { id: string; body: Partial<ICaptain> }>({
            query: ({ id, body }) => ({
                url: `/captains/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Captains"],
        }),

        // DELETE captaincy
        deleteCaptaincy: builder.mutation<IQueryResponse<ICaptain>, string>({
            query: (id) => ({
                url: `/captains/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Captains"],
        }),

    }),
});

export const {
    useGetCaptainsQuery,
    useGetActiveCaptainsQuery,
    useGetCaptaincyStatsQuery,
    useGetCaptaincyByPlayerQuery,
    useGetCaptaincyHistoryByRoleQuery,
    useGetCaptaincyByIdQuery,
    useAssignCaptainMutation,
    useAssignMultipleCaptainsMutation,
    useEndCaptaincyMutation,
    useUpdateCaptaincyMutation,
    useDeleteCaptaincyMutation,
} = captainApi;

export default captainApi;