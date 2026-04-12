// services/fans.endpoints.ts
import { IFan } from "@/types/user";
import { api } from "./api";
 

export const fansApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFanLeaderboard: builder.query<IFan[], { limit?: number; sortBy?: string }>({
            query: ({ limit = 50, sortBy = "fanPoints" }) =>
                `/fans/leaderboard?limit=${limit}&sortBy=${sortBy}`,
            providesTags: ["Fans"]
        }),

        getFanStats: builder.query<{
            totalFans: number;
            totalPoints: number;
            averageEngagement: number;
        }, void>({
            query: () => "/fans/stats",
            providesTags: ["FanStats"]
        }),

        registerAsFan: builder.mutation<void, string>({
            query: (userId) => ({
                url: `/fans/register/${userId}`,
                method: "POST"
            }),
            invalidatesTags: ["Fans", "FanStats"]
        })
    })
});

export const {
    useGetFanLeaderboardQuery,
    useGetFanStatsQuery,
    useRegisterAsFanMutation
} = fansApi;