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
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Teams' as const, id: _id })),
                        { type: 'Teams', id: 'LIST' },
                    ]
                    : [{ type: 'Teams', id: 'LIST' }],
        }),

        // GET team by ID
        getTeamById: builder.query<IQueryResponse<ITeam>, string>({
            query: (id) => `/teams/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Teams', id }],
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
            providesTags: (result, _error, data) => {
                const tags = [];

                // Add individual match tags
                if (result?.data) {
                    tags.push(
                        ...result.data.map(({ _id }) => ({
                            type: 'Teams' as const,
                            id: _id
                        }))
                    );
                }

                // Add team-specific tag
                tags.push({
                    type: 'Teams' as const,
                    id: `TEAM_${data.season}`
                });

                return tags;
            },
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
            providesTags: (_result, _error, teamId) => [
                { type: 'Teams', id: `STATS_${teamId}` },
            ],
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
            invalidatesTags: [
                { type: 'Teams', id: 'LIST' },
                { type: 'Teams', id: 'CLUB_' }, // Invalidate club-specific lists
                { type: 'Teams', id: 'SEASON_' }, // Invalidate season-specific lists
            ],
        }),

        // UPDATE team (full update - PUT)
        updateTeam: builder.mutation<IQueryResponse<ITeam>, Partial<ITeam>>({
            query: ({ _id, ...body }) => ({
                url: `/teams/${_id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { _id: id }) => [
                { type: 'Teams', id: 'LIST' },
                { type: 'Teams', id },
                { type: 'Teams', id: 'CLUB_' },
                { type: 'Teams', id: 'SEASON_' },
                { type: 'Teams', id: `STATS_${id}` },
                { type: 'Teams', id: `PLAYERS_${id}` },
            ],
        }),

        // PATCH team (partial update)
        patchTeam: builder.mutation<IQueryResponse<ITeam>, { id: string; body: Partial<ITeam> }>({
            query: ({ id, body }) => ({
                url: `/teams/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Teams', id: 'LIST' },
                { type: 'Teams', id },
                { type: 'Teams', id: 'CLUB_' },
                { type: 'Teams', id: 'SEASON_' },
                { type: 'Teams', id: `STATS_${id}` },
                { type: 'Teams', id: `PLAYERS_${id}` },
                'Teams'
            ],
        }),

        // DELETE team
        deleteTeam: builder.mutation<IQueryResponse<ITeam>, string>({
            query: (teamId) => ({
                url: `/teams/${teamId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result,) => ['Teams' ],
                
           
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
            invalidatesTags: (_result, _error, { teamId, playerId }) => [
                { type: 'Teams', id: teamId },
                { type: 'Teams', id: `PLAYERS_${teamId}` },
                { type: 'Teams', id: `STATS_${teamId}` },
                { type: 'Players', id: playerId },
                { type: 'Players', id: 'LIST' },
            ],
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
            invalidatesTags: (_result, _error, { teamId, playerId }) => [
                { type: 'Teams', id: teamId },
                { type: 'Teams', id: `PLAYERS_${teamId}` },
                { type: 'Teams', id: `STATS_${teamId}` },
                { type: 'Players', id: playerId },
                { type: 'Players', id: 'LIST' },
            ],
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
            invalidatesTags: (_result, _error, { teamId, playerIds }) => [
                { type: 'Teams', id: teamId },
                { type: 'Teams', id: `PLAYERS_${teamId}` },
                { type: 'Teams', id: `STATS_${teamId}` },
                ...playerIds.map(id => ({ type: 'Players' as const, id })),
                { type: 'Players', id: 'LIST' },
            ],
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
            invalidatesTags: (_result, _error, { teamId }) => [
                { type: 'Teams', id: teamId },
                { type: 'Teams', id: `PLAYERS_${teamId}` },
            ],
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
            providesTags: (_result, _error, { teamId, season }) => [
                { type: 'Teams', id: `MATCHES_${teamId}${season ? `_${season}` : ''}` },
            ],
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
            providesTags: (_result, _error, { teamId }) => [
                { type: 'Teams', id: `FORMATION_${teamId}` },
            ],
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