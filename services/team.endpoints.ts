// team.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ITeam } from "@/types/match.interface";

const teamApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all teams with filtering, pagination
        getTeams: builder.query<IQueryResponse<ITeam[]>, {
            page?: number;
            limit?: number;
            club?: string;
            season?: string;
            search?: string;
            sortBy?: string;
            status?: 'active' | 'inactive' | 'all';
        }>({
            query: (params) => ({
                url: "/teams",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    club: params?.club,
                    season: params?.season,
                    search: params?.search,
                    sortBy: params?.sortBy || 'name',
                    status: params?.status,
                },
            }),
            providesTags: ['Teams']
        }),

        // GET team by ID
        getTeamById: builder.query<IQueryResponse<ITeam>, string>({
            query: (id) => `/teams/${id}`,
            providesTags: ['Teams']
        }),

        // GET teams by season
        getTeamsBySeason: builder.query<IQueryResponse<ITeam[]>, {
            season: string;
            page?: number;
            limit?: number;
            club?: string;
        }>({
            query: ({ season, page, limit, club }) => ({
                url: `/teams/season/${season}`,
                params: { page, limit, club },
            }),
            providesTags: ['Teams']
        }),

        // GET team statistics
        getTeamStats: builder.query<IQueryResponse<{
            totalMatches: number;
            wins: number;
            losses: number;
            draws: number;
            goalsFor: number;
            goalsAgainst: number;
            cleanSheets: number;
            currentForm: Array<'W' | 'D' | 'L'>;
            topScorers: Array<{ playerId: string; name: string; goals: number }>;
            upcomingMatches: Array<{ matchId: string; opponent: string; date: string }>;
        }>, string>({
            query: (teamId) => `/teams/${teamId}/stats`,
            providesTags: ['Teams']
        }),

        // GET team players
        getTeamPlayers: builder.query<IQueryResponse<any[]>, {
            teamId: string;
            status?: 'active' | 'injured' | 'suspended' | 'all';
            position?: string;
        }>({
            query: ({ teamId, status, position }) => ({
                url: `/teams/${teamId}/players`,
                params: { status, position },
            }),
            providesTags: (result, _error, { teamId }) => [
                ...(result?.data?.map(({ _id }) => ({ type: 'Players' as const, id: _id })) || []),
                { type: 'Teams' as const, id: teamId },
            ],
        }),

        // CREATE team
        createTeam: builder.mutation<IQueryResponse<ITeam>, Partial<ITeam>>({
            query: (body) => ({
                url: "/teams",
                method: "POST",
                body,
            }),
            invalidatesTags: ['Teams']
        }),

        // UPDATE team (full update - PUT)
        updateTeam: builder.mutation<IQueryResponse<ITeam>, Partial<ITeam>>({
            query: ({ _id, ...body }) => ({
                url: `/teams/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: () => ['Teams']
        }),

        // PATCH team (partial update)
        patchTeam: builder.mutation<IQueryResponse<ITeam>, { id: string; body: Partial<ITeam> }>({
            query: ({ id, body }) => ({
                url: `/teams/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ['Teams']
        }),

        // DELETE team
        deleteTeam: builder.mutation<IQueryResponse<ITeam>, string>({
            query: (teamId) => ({
                url: `/teams/${teamId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result,) => ['Teams'],


        }),

        // ADD player to team
        addPlayerToTeam: builder.mutation<IQueryResponse<ITeam>, {
            teamId: string;
            playerId: string;
            contract?: {
                startDate: string;
                endDate?: string;
                jerseyNumber?: number;
                position?: string;
            };
        }>({
            query: ({ teamId, playerId, contract }) => ({
                url: `/teams/${teamId}/players`,
                method: "POST",
                body: { playerId, contract },
            }),
            invalidatesTags: ['Teams']
        }),

        // REMOVE player from team
        removePlayerFromTeam: builder.mutation<IQueryResponse<ITeam>, {
            teamId: string;
            playerId: string;
            releaseDate?: string;
        }>({
            query: ({ teamId, playerId, releaseDate }) => ({
                url: `/teams/${teamId}/players/${playerId}`,
                method: "DELETE",
                params: { releaseDate },
            }),
            invalidatesTags: ['Teams']
        }),

        // BULK add players to team
        bulkAddPlayersToTeam: builder.mutation<IQueryResponse<ITeam>, {
            teamId: string;
            playerIds: string[];
        }>({
            query: ({ teamId, playerIds }) => ({
                url: `/teams/${teamId}/players/bulk`,
                method: "POST",
                body: { playerIds },
            }),
            invalidatesTags: ['Teams']
        }),

        // UPDATE team captain
        updateTeamCaptain: builder.mutation<IQueryResponse<ITeam>, {
            teamId: string;
            playerId: string;
        }>({
            query: ({ teamId, playerId }) => ({
                url: `/teams/${teamId}/captain`,
                method: "PATCH",
                body: { captainId: playerId },
            }),
            invalidatesTags: ['Teams']
        }),

        // GET team matches
        getTeamMatches: builder.query<IQueryResponse<any[]>, {
            teamId: string;
            season?: string;
            status?: 'upcoming' | 'completed' | 'all';
            limit?: number;
        }>({
            query: ({ teamId, season, status, limit }) => ({
                url: `/teams/${teamId}/matches`,
                params: { season, status, limit },
            }),
            providesTags: ['Teams']
        }),

        // GET team formation/lineup
        getTeamFormation: builder.query<IQueryResponse<{
            formation: string;
            startingXI: Array<{ playerId: string; name: string; position: string }>;
            substitutes: Array<{ playerId: string; name: string; position: string }>;
        }>, { teamId: string; matchId?: string }>({
            query: ({ teamId, matchId }) => ({
                url: `/teams/${teamId}/formation`,
                params: { matchId },
            }),
            providesTags: ['Teams']
        }),
    }),
});

export const {
    // Queries
    useGetTeamsQuery,
    useGetTeamByIdQuery,
    useGetTeamsBySeasonQuery,
    useGetTeamStatsQuery,
    useGetTeamPlayersQuery,
    useGetTeamMatchesQuery,
    useGetTeamFormationQuery,

    // Mutations
    useCreateTeamMutation,
    useUpdateTeamMutation,
    usePatchTeamMutation,
    useDeleteTeamMutation,
    useAddPlayerToTeamMutation,
    useRemovePlayerFromTeamMutation,
    useBulkAddPlayersToTeamMutation,
    useUpdateTeamCaptainMutation,

    // Lazy queries
    useLazyGetTeamsQuery,
    useLazyGetTeamByIdQuery,
    useLazyGetTeamsBySeasonQuery,
    useLazyGetTeamStatsQuery,
    useLazyGetTeamPlayersQuery,
} = teamApi;

export default teamApi;