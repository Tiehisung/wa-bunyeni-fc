// news.endpoint.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { INewsProps, IPostNews } from "@/types/news.interface";

const newsApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all news (with pagination, filtering)
        getNews: builder.query<IQueryResponse<INewsProps[]>, string>({
            query: (paramsString = '') => `/news?${paramsString}`,
            providesTags: ['News'],

        }),

        // GET trending news (most viewed/liked)
        getTrendingNews: builder.query<IQueryResponse<INewsProps[]>, { limit?: number }>({
            query: (params) => ({
                url: "/news/trending",
                params: { limit: params?.limit || 5 },
            }),
            providesTags: ['News'],
        }),

        // GET latest news
        getLatestNews: builder.query<IQueryResponse<INewsProps[]>, { limit?: number }>({
            query: (params) => ({
                url: "/news/latest",
                params: { limit: params?.limit || 5 },
            }),
            providesTags: ['News'],
        }),

        // GET news by category
        getNewsByCategory: builder.query<IQueryResponse<INewsProps[]>, {
            category: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ category, page, limit }) => ({
                url: `/news/category/${category}`,
                params: { page, limit },
            }),
            providesTags: ['News']
        }),

        // GET news by slug
        getNewsItem: builder.query<IQueryResponse<INewsProps>, string>({
            query: (slug) => `/news/${slug}`,
            providesTags: ['News']
        }),



        // CREATE news article
        createNews: builder.mutation<IQueryResponse<INewsProps>, Partial<IPostNews>>({
            query: (body) => ({
                url: "/news",
                method: "POST",
                body,
            }),
            invalidatesTags: ['News'],
        }),

        // UPDATE news article (full update - PUT)
        updateNews: builder.mutation<IQueryResponse<INewsProps>, Partial<INewsProps>>({
            query: ({ _id: id, ...body }) => ({
                url: `/news/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ['News']
        }),

        // PATCH news article (partial update)
        patchNews: builder.mutation<IQueryResponse<INewsProps>, { id: string; body: Partial<INewsProps> }>({
            query: ({ id, body }) => ({
                url: `/news/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ['News']
        }),

        // TOGGLE publish status (publish/unpublish)
        togglePublishStatus: builder.mutation<IQueryResponse<INewsProps>, {
            id: string;
            publish: boolean;
            scheduledDate?: string;
        }>({
            query: ({ id, publish, scheduledDate }) => ({
                url: `/news/${id}/publish`,
                method: "PATCH",
                body: { publish, scheduledDate },
            }),
            invalidatesTags: ['News']
        }),

        // LIKE news article
        likeNews: builder.mutation<IQueryResponse<{ likes: number }>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}/like`,
                method: "POST",
            }),
            invalidatesTags: ['News']
        }),

        // UNLIKE news article
        unlikeNews: builder.mutation<IQueryResponse<{ likes: number }>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}/unlike`,
                method: "POST",
            }),
            invalidatesTags: ['News']
        }),

        // SHARE news article
        shareNews: builder.mutation<IQueryResponse<{ shares: number }>, {
            newsId: string;
            platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email';
        }>({
            query: ({ newsId, platform }) => ({
                url: `/news/${newsId}/share`,
                method: "POST",
                body: { platform },
            }),
            invalidatesTags: ['News']
        }),

        // DELETE news article
        deleteNews: builder.mutation<IQueryResponse<INewsProps>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['News']
        }),

        // BULK DELETE news articles
        bulkDeleteNews: builder.mutation<IQueryResponse<{ deletedCount: number }>, string[]>({
            query: (newsIds) => ({
                url: "/news/bulk/delete",
                method: "POST",
                body: { newsIds },
            }),
            invalidatesTags: ['News']
        }),

        // GET related news
        getRelatedNews: builder.query<IQueryResponse<INewsProps[]>, {
            newsId: string;
            limit?: number;
        }>({
            query: ({ newsId, limit }) => ({
                url: `/news/${newsId}/related`,
                params: { limit: limit || 3 },
            }),
            providesTags: ['News']
        }),

        // GET news by author
        getNewsByAuthor: builder.query<IQueryResponse<INewsProps[]>, {
            authorId: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ authorId, page, limit }) => ({
                url: `/news/author/${authorId}`,
                params: { page, limit },
            }),
            providesTags: ['News']
        }),

        // INCREMENT view count
        incrementViewCount: builder.mutation<IQueryResponse<{ views: number }>, string>({
            query: (newsId) => ({
                url: `/news/${newsId}/view`,
                method: "POST",
            }),
            invalidatesTags: ['News']
        }),

        // Update views
        updateNewsViews: builder.mutation<IQueryResponse<{ views: number }>, IInteractionPayload>({
            query: ({ newsId, ...body }) => ({
                url: `/news/${newsId}/views`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { newsId }) => [{ type: "News", id: newsId }, 'News'],
        }),

        // Update comments
        updateNewsComments: builder.mutation<
            IQueryResponse<{ comments: any[]; totalComments: number }>,
            UpdateCommentPayload
        >({
            query: ({ newsId, ...body }) => ({
                url: `/news/${newsId}/comments`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { newsId }) => [{ type: "News", id: newsId }, 'News'],
        }),

        // Delete comment
        deleteNewsComment: builder.mutation<IQueryResponse<{ totalComments: number }>, DeleteCommentPayload>({
            query: ({ newsId, ...body }) => ({
                url: `/news/${newsId}/comments`,
                method: "DELETE",
                body,
            }),
            invalidatesTags: (_result, _error, { newsId }) => [{ type: "News", id: newsId }, 'News'],
        }),

        // Update shares
        updateNewsShares: builder.mutation<IQueryResponse<{ shares: number }>, IInteractionPayload>({
            query: ({ newsId, ...body }) => ({
                url: `/news/${newsId}/shares`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { newsId }) => [{ type: "News", id: newsId }, 'News'],
        }),

        // Update likes (NEW)
        updateNewsLikes: builder.mutation<IQueryResponse<{ liked: boolean; likes: number }>, UpdateLikePayload>({
            query: ({ newsId, ...body }) => ({
                url: `/news/${newsId}/likes`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { newsId }) => [{ type: "News", id: newsId }, 'News'],
        }),

        // Get news stats
        getNewsStats: builder.query<
            IQueryResponse<{ views: number; comments: number; shares: number; likes: number }>,
            string
        >({
            query: (newsId) => `/news/${newsId}/stats`,
            providesTags: (_result, _error, newsId) => [{ type: "News", id: newsId }, 'News'],
        }),

        // GET news stats (views, likes, shares)
        // getNewsStats: builder.query<IQueryResponse<{
        //     totalViews: number;
        //     totalLikes: number;
        //     totalShares: number;
        //     averageReadTime: number;
        //     topCategories: Array<{ category: string; count: number }>;
        // }>, { startDate?: string; endDate?: string }>({
        //     query: (params) => ({
        //         url: "/news/stats",
        //         params,
        //     }),
        //     providesTags: ['News'],
        // }),
    }),
});

export const {
    // Queries
    useGetNewsQuery,
    useGetNewsItemQuery,
    useGetTrendingNewsQuery,
    useGetLatestNewsQuery,
    useGetNewsByCategoryQuery,
    useGetNewsStatsQuery,
    useGetRelatedNewsQuery,
    useGetNewsByAuthorQuery,

    // Mutations
    useCreateNewsMutation,
    useUpdateNewsMutation,
    usePatchNewsMutation,
    useTogglePublishStatusMutation,
    useLikeNewsMutation,
    useUnlikeNewsMutation,
    useShareNewsMutation,
    useDeleteNewsMutation,
    useBulkDeleteNewsMutation,
    useIncrementViewCountMutation,
    useUpdateNewsViewsMutation,
    useUpdateNewsCommentsMutation,
    useDeleteNewsCommentMutation,
    useUpdateNewsSharesMutation,
    useUpdateNewsLikesMutation,
    // Lazy queries
    useLazyGetNewsQuery,
    useLazyGetTrendingNewsQuery,
    useLazyGetLatestNewsQuery,
    useLazyGetNewsByCategoryQuery,
    useLazyGetNewsItemQuery,
} = newsApi;

// Export the API for use in store
export default newsApi;

interface IInteractionPayload {
    newsId: string;
    userId: string
    deviceId: string;
}

interface UpdateCommentPayload {
    newsId: string;
    userId?: string;
    comment: string;
}



interface DeleteCommentPayload {
    newsId: string;
    userId?: string;
    commentId: string;
    isAdmin?: boolean;
}
interface UpdateLikePayload {
    newsId: string;
    userId?: string;
    deviceId: string;
    isLike?: boolean;
}

