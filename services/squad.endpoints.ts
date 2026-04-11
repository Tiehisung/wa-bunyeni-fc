// squad.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ISquad } from "@/types/squad.interface";

const squadApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all squads
        getSquads: builder.query<IQueryResponse<ISquad[]>, string>({
            query: (paramsString = '') => `/squads?${paramsString}`,
            providesTags: ["Squads",'Matches'],
        }),

        // GET squad by ID
        getSquadById: builder.query<IQueryResponse<ISquad>, string>({
            query: (id) => `/squads/${id}`,
            providesTags: ["Squads",'Matches'],
        }),

        // GET squad by match
        getSquadByMatch: builder.query<IQueryResponse<ISquad>, string>({
            query: (matchId) => `/squads/match/${matchId}`,
            providesTags: ["Squads",'Matches'],
        }),

        // GET squad statistics
        getSquadStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/squads/stats",
            providesTags: ["Squads",'Matches'],
        }),

        // CREATE squad
        createSquad: builder.mutation<IQueryResponse<ISquad>, Partial<ISquad>>({
            query: (body) => ({
                url: "/squads",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

        // UPDATE squad
        updateSquad: builder.mutation<IQueryResponse<ISquad>, { id: string; body: Partial<ISquad> }>({
            query: ({ id, body }) => ({
                url: `/squads/${id}`,
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
                url: `/squads/${id}/players`,
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
                url: `/squads/${squadId}/substitutions`,
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
                url: `/squads/${id}/formation`,
                method: "PATCH",
                body: { formation },
            }),
            invalidatesTags: ["Squads",'Matches'],
        }),

        // DELETE squad
        deleteSquad: builder.mutation<IQueryResponse<ISquad>, string>({
            query: (id) => ({
                url: `/squads/${id}`,
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