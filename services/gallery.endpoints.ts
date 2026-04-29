// services/galleries.endpoints.ts
import type { IQueryResponse } from "@/types";
import { api } from "./api";
import type { ICloudinaryFile, IGallery } from "@/types/file.interface";

const galleriesApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Get all galleries with optional pagination/filtering
        getGalleries: builder.query<IQueryResponse<IGallery[]>, string | void>({
            query: (queryString = "") => `/galleries?${queryString}`,
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ _id }) => ({ type: 'Gallery' as const, id: _id })),
                        { type: 'Gallery', id: 'LIST' },
                    ]
                    : [{ type: 'Gallery', id: 'LIST' }],
        }),

        // Get single gallery by ID
        getGalleryById: builder.query<IQueryResponse<IGallery>, string>({
            query: (galleryId) => `/galleries/${galleryId}`,
            providesTags: ['Gallery'],
        }),

        // Get galleries by tag
        getGalleriesByTag: builder.query<IQueryResponse<IGallery[]>, { tag: string; queryString?: string }>({
            query: ({ tag, queryString = "" }) => `/galleries/tag/${encodeURIComponent(tag)}${queryString}`,
            providesTags: ['Gallery'],
        }),

        // Create new gallery
        createGallery: builder.mutation<IQueryResponse<IGallery>, Partial<IGallery>>({
            query: (body) => ({
                url: "/galleries",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: 'Gallery', id: 'LIST' }],
        }),

        // Update entire gallery
        updateGallery: builder.mutation<IQueryResponse<IGallery>, Partial<IGallery>>({
            query: (body) => ({
                url: `/galleries/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                { type: 'Gallery', id: _id },
                { type: 'Gallery', id: 'LIST' },
            ],
        }),

        // Partial update of gallery
        patchGallery: builder.mutation<IQueryResponse<IGallery>, Partial<IGallery>>({
            query: (body) => ({
                url: `/galleries/${body._id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { _id }) => [
                { type: 'Gallery', id: _id },
                { type: 'Gallery', id: 'LIST' },
            ],
        }),

        // Delete gallery
        deleteGallery: builder.mutation<IQueryResponse<null>, string>({
            query: (galleryId) => ({
                url: `/galleries/${galleryId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: 'Gallery', id: 'LIST' }],
        }),

        // Add files to existing gallery
        addFilesToGallery: builder.mutation<
            IQueryResponse<IGallery>,
            { galleryId: string; files: ICloudinaryFile[] }
        >({
            query: ({ galleryId, files }) => ({
                url: `/galleries/${galleryId}/files`,
                method: "POST",
                body: { files },
            }),
            invalidatesTags: (_result, _error, { galleryId }) => [
                { type: 'Gallery', id: galleryId },
            ],
        }),

        // Remove file from gallery
        removeFileFromGallery: builder.mutation<
            IQueryResponse<IGallery>,
            { galleryId: string; fileId: string }
        >({
            query: ({ galleryId, fileId }) => ({
                url: `/galleries/${galleryId}/files/${fileId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { galleryId }) => [
                { type: 'Gallery', id: galleryId },
            ],
        }),

        // Get gallery statistics
        getGalleryStats: builder.query<IQueryResponse<{
            totalGalleries: number;
            totalImages: number;
            totalVideos: number;
            mostUsedTags: Array<{ tag: string; count: number }>;
        }>, void>({
            query: () => "/galleries/stats",
            providesTags: ['Gallery'],
        }),
    }),
});

export const {
    // Query hooks
    useGetGalleriesQuery,
    useGetGalleryByIdQuery,
    useGetGalleriesByTagQuery,
    useGetGalleryStatsQuery,

    // Mutation hooks
    useCreateGalleryMutation,
    useUpdateGalleryMutation,
    usePatchGalleryMutation,
    useDeleteGalleryMutation,
    useAddFilesToGalleryMutation,
    useRemoveFileFromGalleryMutation,
} = galleriesApi;