// squad.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ISquad } from "@/types/squad.interface";

const squadApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all squads
        getSquads: builder.query<IQueryResponse<ISquad[]>, string>({
            query: (paramsString = '') => `/squad?${paramsString}`,
            providesTags: ["Squads",'Matches'],
        }),

        // GET squad by ID
        getSquadById: builder.query<IQueryResponse<ISquad>, string>({
            query: (id) => `/squad/${id}`,
            providesTags: ["Squads",'Matches'],
        }),

        // GET squad by match
        getSquadByMatch: builder.query<IQueryResponse<ISquad>, string>({
            query: (matchId) => `/squad/match/${matchId}`,
            providesTags: ["Squads",'Matches'],
        }),

        // GET squad statistics
        getSquadStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/squad/stats",
            providesTags: ["Squads",'Matches'],
        }),

        // CREATE squad
        createSquad: builder.mutation<IQueryResponse<ISquad>, Partial<ISquad>>({
            query: (body) => ({
                url: "/squad",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

        // UPDATE squad
        updateSquad: builder.mutation<IQueryResponse<ISquad>, { id: string; body: Partial<ISquad> }>({
            query: ({ id, body }) => ({
                url: `/squad/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

        // UPDATE squad players (starting XI, substitutes)
        updateSquadPlayers: builder.mutation<IQueryResponse<ISquad>, {
            id: string;
            startingXI?: string[];
            substitutes?: string[];
            captain?: string;
            viceCaptain?: string;
        }>({
            query: ({ id, startingXI, substitutes, captain, viceCaptain }) => ({
                url: `/squad/${id}/players`,
                method: "PATCH",
                body: { startingXI, substitutes, captain, viceCaptain },
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

        // ADD substitution
        addSubstitution: builder.mutation<IQueryResponse<ISquad>, {
            squadId: string;
            playerOut: string;
            playerIn: string;
            minute: number;
            reason?: string;
        }>({
            query: ({ squadId, playerOut, playerIn, minute, reason }) => ({
                url: `/squad/${squadId}/substitutions`,
                method: "POST",
                body: { playerOut, playerIn, minute, reason },
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

        // UPDATE formation
        updateFormation: builder.mutation<IQueryResponse<ISquad>, {
            id: string;
            formation: string;
        }>({
            query: ({ id, formation }) => ({
                url: `/squad/${id}/formation`,
                method: "PATCH",
                body: { formation },
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

        // DELETE squad
        deleteSquad: builder.mutation<IQueryResponse<ISquad>, string>({
            query: (id) => ({
                url: `/squad/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

    }),
});

export const {
    useGetSquadsQuery,
    useGetSquadByIdQuery,
    useGetSquadByMatchQuery,
    useGetSquadStatsQuery,
    useCreateSquadMutation,
    useUpdateSquadMutation,
    useUpdateSquadPlayersMutation,
    useAddSubstitutionMutation,
    useUpdateFormationMutation,
    useDeleteSquadMutation,
} = squadApi;

export default squadApi;