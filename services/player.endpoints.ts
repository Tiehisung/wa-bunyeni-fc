import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { IPlayer,   } from "@/types/player.interface";
import { IPlayersStats, IPlayerStats } from "@/types/stats";
import { IPostPlayer } from "@/app/admin/players/new/NewSigningForms";


const playerApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getPlayers: builder.query<IQueryResponse<IPlayer[]>, string>({
            query: (paramsString = '') => `/players?${paramsString}`,
            providesTags: ["Players"],
        }),
        getPlayer: builder.query<IQueryResponse<IPlayer>, string>({
            query: (slugOrId) => `/players/${slugOrId}`,
            providesTags: ["Players"],
        }),

        createPlayer: builder.mutation<IQueryResponse<IPlayer>, IPostPlayer>({
            query: (body) => ({
                url: "players",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Players"],
        }),
        updatePlayer: builder.mutation<IQueryResponse<IPlayer>, Partial<IPlayer>>({
            query: (body) => ({
                url: `players/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Players"],
        }),
        patchPlayer: builder.mutation<IQueryResponse<IPlayer>, Partial<IPlayer>>({
            query: (body) => ({
                url: `players/${body._id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Players"],
        }),

        deletePlayer: builder.mutation<IQueryResponse<IPlayer>, string>({
            query: (playerId) => ({
                url: `/players/${playerId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Players"],
        }),
        getPlayersStats: builder.query<IQueryResponse<IPlayersStats>, void>({
            query: () => `/players/stats`,
            providesTags: (_result, _error,) => ['Players'],
        }),
        getPlayerStats: builder.query<IQueryResponse<IPlayerStats>, string>({
            query: (playerId) => `/players/stats/${playerId}`,
            providesTags: (_result, _error,) => ['Players'],
        }),


    }),
});

export const {
    useGetPlayersQuery,
    useGetPlayerQuery,
    useGetPlayerStatsQuery,
    useGetPlayersStatsQuery,

    useCreatePlayerMutation,
    useUpdatePlayerMutation,
    usePatchPlayerMutation,
    useDeletePlayerMutation
} = playerApi;