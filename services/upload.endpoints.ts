import { ICloudinaryFile, } from '@/types/file.interface';
import { api } from './api';
import { IQueryResponse } from '@/types';

export interface UploadMixedResponse {
    success: boolean;
    data: {
        avatar?: ICloudinaryFile[];
        gallery?: ICloudinaryFile[];
        video?: ICloudinaryFile[];
        documents?: ICloudinaryFile[];
    };
}

export const uploadApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // SINGLE UPLOADS

        /**
         * Upload a single image (avatar, profile pic, etc)
         * @param formData - FormData with field name 'image'
         * @example
         * const formData = new FormData();
         * formData.append('image', file);
         */
        uploadImage: builder.mutation<IQueryResponse<ICloudinaryFile>, FormData>({
            query: (formData) => ({
                url: '/upload/image',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads', 'Documents', 'Folders'],
        }),

        /**
         * Upload a single video (match highlights, etc)
         * @param formData - FormData with field name 'video'
         */
        uploadVideo: builder.mutation<IQueryResponse<ICloudinaryFile>, FormData>({
            query: (formData) => ({
                url: '/upload/video',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads', 'Documents', 'Folders'],
        }),

        /**
         * Upload a document (PDF, etc)
         * @param formData - FormData with field name 'document'
         */
        uploadDocument: builder.mutation<IQueryResponse<ICloudinaryFile>, FormData>({
            query: (formData) => ({
                url: '/upload/document',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads', 'Documents', 'Folders'],
        }),

        // MULTIPLE UPLOADS

        /**
         * Upload multiple images (gallery)
         * @param formData - FormData with field name 'images' (multiple files)
         * @example
         * const formData = new FormData();
         * files.forEach(file => formData.append('images', file));
         */
        uploadGallery: builder.mutation<IQueryResponse<ICloudinaryFile[]>, FormData>({
            query: (formData) => ({
                url: '/upload/gallery',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads'],
        }),

        // MIXED UPLOADS

        /**
         * Upload different file types in one request
         * @param formData - FormData with fields:
         *   - 'avatar': single file
         *   - 'gallery': multiple files
         *   - 'video': single video
         */
        uploadMixed: builder.mutation<UploadMixedResponse, FormData>({
            query: (formData) => ({
                url: '/upload/mixed',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Uploads','Documents','Folders'],
        }),

        // DELETE

        /**
         * Delete a file from Cloudinary
         * @param public_id - The Cloudinary public_id
         * @param resource_type - 'image' | 'video' | 'raw' (default: 'image')
         */
        deleteFile: builder.mutation<IQueryResponse, {
            public_id: string;
            resource_type?: 'image' | 'video' | 'raw'
        }>({
            query: ({ public_id, resource_type = 'image' }) => ({
                url: `/upload`,
                method: 'DELETE',
                body: { public_id, resource_type }
            }),
            invalidatesTags: ['Uploads'],
        }),
    }),
});

export const {
    // Single upload hooks
    useUploadImageMutation,
    useUploadVideoMutation,
    useUploadDocumentMutation,

    // Multiple upload hooks
    useUploadGalleryMutation,

    // Mixed upload hooks
    useUploadMixedMutation,

    // Delete hook
    useDeleteFileMutation,
} = uploadApi;