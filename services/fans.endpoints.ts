// services/fan.endpoints.ts
import { IMiniUser } from "@/types/user";
import { api } from "./api";
import { EFanBadge, IFan } from "@/types/fan.interface";
import { IQueryResponse } from "@/types";

export interface IFanLeaderboardEntry {
  rank: number;
  user: IMiniUser;
  points: number;
  engagementScore: number;
  badges: EFanBadge[];
  contributions: IFan["contributions"];
  fanSince: string;
}

export interface IFanStats {
  totalFans: number;
  totalPoints: number;
  averageEngagement: number;
  topFans: Array<{
    _id: string;
    user: IMiniUser;
    points: number;
  }>;
}

export const fanApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user's fan profile
    getMyFanProfile: builder.query<IQueryResponse<IFan>, void>({
      query: () => "/fans/me",
      providesTags: ["Fans"],
    }),

    // Get fan profile by user ID
    getFanByUserId: builder.query<IQueryResponse<IFan>, string>({
      query: (userId) => `/fans/user/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: "Fans", id: userId }],
    }),

    // Get fan leaderboard
    getFanLeaderboard: builder.query<
      IQueryResponse<IFanLeaderboardEntry[]>,
      { limit?: number; sortBy?: "points" | "engagementScore" }
    >({
      query: (params = { limit: 50, sortBy: "points" }) => ({
        url: `/fans/leaderboard`,
        params,
      }),
      providesTags: ["Fans"],
    }),

    // Get fan statistics
    getFanStats: builder.query<IQueryResponse<IFanStats>, void>({
      query: () => "/fans/stats",
      providesTags: ["FanStats"],
    }),

    // Update fan preferences
    updateFanPreferences: builder.mutation<
      IQueryResponse<IFan>,
      Partial<IFan["preferences"]>
    >({
      query: (preferences) => ({
        url: "/fans/preferences",
        method: "PATCH",
        body: { preferences },
      }),
      invalidatesTags: ["Fans"],
    }),

    // Get fan points history (optional - for activity feed)
    getFanPointsHistory: builder.query<
      IQueryResponse<
        Array<{ action: string; points: number; date: string; newsId?: string }>
      >,
      { limit?: number }
    >({
      query: ({ limit = 20 }) => `/fans/history?limit=${limit}`,
      providesTags: ["FanHistory"],
    }),
  }),
});

export const {
  useGetMyFanProfileQuery,
  useGetFanByUserIdQuery,
  useGetFanLeaderboardQuery,
  useGetFanStatsQuery,
  useUpdateFanPreferencesMutation,
  useGetFanPointsHistoryQuery,
} = fanApi;
