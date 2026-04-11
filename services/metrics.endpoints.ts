// dashboard.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import { IDashboardMetrics, ISeasonMetrics, IHeadToHeadMetrics, IPlayerMetrics, IPlayersOverviewMetrics, ITrendMetrics } from "@/types/metrics.interface";



const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET dashboard metrics
        getDashboardMetrics: builder.query<IQueryResponse<IDashboardMetrics>, {
            season?: string;
            tournament?: string;
        }>({
            query: (params) => ({
                url: "/metrics/dashboard",
                params,
            }),
            providesTags: ["Metrics"],
        }),

        // GET season metrics
        getSeasonMetrics: builder.query<IQueryResponse<ISeasonMetrics>, {
            seasonId: string;
        }>({
            query: ({ seasonId }) => `/metrics/dashboard/season/${seasonId}`,
            providesTags: ["Metrics"],
        }),

        // GET head to head metrics
        getHeadToHeadMetrics: builder.query<IQueryResponse<IHeadToHeadMetrics>, string>({
            query: (opponentId) => `/metrics/head-to-head/${opponentId}`,
            providesTags: ["Metrics"],
        }),

        // GET player metrics
        getPlayerMetrics: builder.query<IQueryResponse<IPlayerMetrics>, {
            playerId: string;
            season?: string;
        }>({
            query: (params) => ({
                url: `/metrics/dashboard/player/${params.playerId}`,
                params: { season: params.season },
            }),
            providesTags: ["Metrics"],
        }),

        // GET overview metrics
        getPlayersOverviewMetrics: builder.query<IQueryResponse<IPlayersOverviewMetrics>, {
            timeframe?: 'day' | 'week' | 'month' | 'season' | 'year';
            date?: string;
        }>({
            query: (params) => ({
                url: "/metrics/players/overview",
                params,
            }),
            providesTags: ["Metrics"],
        }),

        // GET metric trends
        getMetricTrends: builder.query<IQueryResponse<ITrendMetrics>, {
            metric: string;
            period: 'daily' | 'weekly' | 'monthly';
            fromDate: string;
            toDate: string;
        }>({
            query: (params) => ({
                url: "/metrics/dashboard/trends",
                params,
            }),
            providesTags: ["Metrics"],
        }),

    }),
});

export const {
    useGetDashboardMetricsQuery,
    useGetSeasonMetricsQuery,
    useGetHeadToHeadMetricsQuery,
    useGetPlayerMetricsQuery,
    useGetPlayersOverviewMetricsQuery,
    useGetMetricTrendsQuery,

    // Lazy queries
    useLazyGetDashboardMetricsQuery,
    useLazyGetSeasonMetricsQuery,
    useLazyGetHeadToHeadMetricsQuery,
    useLazyGetPlayerMetricsQuery,
    useLazyGetPlayersOverviewMetricsQuery,
    useLazyGetMetricTrendsQuery,
} = dashboardApi;

export default dashboardApi;