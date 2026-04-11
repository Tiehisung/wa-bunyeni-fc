// mvp.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IMVP } from "@/types/mvp.interface";

const mvpApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all MVPs
        getMvps: builder.query<IQueryResponse<IMVP[]>, string>({
            query: (params) => `/mvps${params ? `?${params}` : ""}`,
            providesTags: ["MVPs"],
        }),

        // GET MVP by ID
        getMvp: builder.query<IQueryResponse<IMVP>, string>({
            query: (id) => `/mvps/${id}`,
            providesTags: ["MVPs"],
        }),

        // GET MVPs by player
        getMvpsByPlayer: builder.query<IQueryResponse<IMVP[]>, string>({
            query: (playerId) => `/mvps/player/${playerId}`,
            providesTags: ["MVPs"],
        }),

        // GET MVP by match
        getMvpByMatch: builder.query<IQueryResponse<IMVP>, string>({
            query: (matchId) => `/mvps/match/${matchId}`,
            providesTags: ["MVPs"],
        }),

        // GET MVP statistics
        getMvpStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/mvps/stats",
            providesTags: ["MVPs"],
        }),

        // GET MVP leaderboard
        getMvpLeaderboard: builder.query<IQueryResponse<any>, {
            season?: string;
            tournament?: string;
            limit?: number;
        }>({
            query: (params) => ({
                url: "/mvps/leaderboard",
                params: {
                    season: params?.season,
                    tournament: params?.tournament,
                    limit: params?.limit || 10,
                },
            }),
            providesTags: ["MVPs"],
        }),

        // CREATE MVP
        createMvp: builder.mutation<IQueryResponse<IMVP>, Partial<IMVP>>({
            query: (body) => ({
                url: "/mvps",
                method: "POST",
                body,
            }),
            invalidatesTags: ["MVPs"],
        }),

        // UPDATE MVP by ID (full update)
        updateMvp: builder.mutation<IQueryResponse<IMVP>, Partial<IMVP>>({
            query: ({ _id, ...body }) => ({
                url: `/mvps/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["MVPs"],
        }),

        // PATCH MVP by ID (partial update)
        patchMvp: builder.mutation<IQueryResponse<IMVP>, { id: string; body: Partial<IMVP> }>({
            query: ({ id, body }) => ({
                url: `/mvps/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["MVPs"],
        }),

        // DELETE MVP by ID
        deleteMvp: builder.mutation<IQueryResponse<IMVP>, string>({
            query: (id) => ({
                url: `/mvps/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MVPs"],
        }),

        // TRANSFER MVP (award to different player)
        transferMvp: builder.mutation<IQueryResponse<IMVP>, {
            id: string;
            toPlayerId: string;
            reason?: string;
        }>({
            query: ({ id, toPlayerId, reason }) => ({
                url: `/mvps/${id}/transfer`,
                method: "POST",
                body: { toPlayerId, reason },
            }),
            invalidatesTags: ["MVPs"],
        }),

    }),
});

export const {
    useGetMvpsQuery,
    useGetMvpQuery,
    useGetMvpsByPlayerQuery,
    useGetMvpByMatchQuery,
    useGetMvpStatsQuery,
    useGetMvpLeaderboardQuery,
    useCreateMvpMutation,
    useUpdateMvpMutation,
    usePatchMvpMutation,
    useDeleteMvpMutation,
    useTransferMvpMutation,
} = mvpApi;

export default mvpApi;