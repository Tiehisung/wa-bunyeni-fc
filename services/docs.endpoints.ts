// documents.endpoints.ts
import type { IQueryParams, IQueryResponse } from "@/types";
import { api } from "./api";
import type { IDocFile, IFolder, } from "@/types/doc";
import { formatError } from "@/lib/error";

const documentsApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // Document endpoints
        getDocuments: builder.query<IQueryResponse<IDocFile[]>, IQueryParams>({
            query: (params) => ({ url: `/documents`, params }),
            providesTags: ["Folders", 'Documents'],
            transformErrorResponse: (response) => formatError(response),
        }),

        getDocumentById: builder.query<IQueryResponse<IDocFile>, string>({
            query: (documentId) => `/documents/${documentId}`,
            providesTags: ["Folders", 'Documents'],
            transformErrorResponse: (response) => formatError(response),
        }),

        createDocuments: builder.mutation<IQueryResponse<IDocFile>, { folderId: string, files: IDocFile[] }>({
            query: (body) => ({
                url: "/documents",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Documents", "Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        updateDocument: builder.mutation<IQueryResponse<IDocFile>, Partial<IDocFile>>({
            query: (body) => ({
                url: `/documents/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Documents", "Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        deleteDocuments: builder.mutation<IQueryResponse<null>, string[]>({
            query: (documentIds) => ({
                url: "/documents/batch",
                method: "DELETE",
                body: { documentIds },
            }),
            invalidatesTags: ["Documents", "Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        deleteDocument: builder.mutation<IQueryResponse<null>, string>({
            query: (documentId) => ({
                url: `/documents/${documentId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Documents", "Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        moveDocuments: builder.mutation<
            IQueryResponse<null>,
            { fileIds: string[]; destinationFolderId: string }
        >({
            query: (body) => ({
                url: "/documents/move",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Documents", "Folders"],
            transformErrorResponse: (response) => formatError(response),
        }),

        // Folder endpoints
        getFolders: builder.query<IQueryResponse<IFolder[]>, IQueryParams>({
            query: (params) => ({ url: `/documents/folders`, params }),
            providesTags: ["Folders", 'Documents'],
            transformErrorResponse: (response) => formatError(response),

        }),

        getFolderById: builder.query<IQueryResponse<IFolder>, string>({
            query: (folderId) => `/documents/folders/${(folderId)}`,
            providesTags: ["Folders"],
            transformErrorResponse: (response) => formatError(response),
        }),

        getFolderDocuments: builder.query<
            IQueryResponse<IDocFile[]>,
            { folderId: string; queryString?: string }
        >({
            query: ({ folderId, }) =>
                `/documents/folders/${folderId}/documents`,
            providesTags: ["Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        createFolder: builder.mutation<IQueryResponse<IFolder>, Partial<IFolder>>({
            query: (body) => ({
                url: "/documents/folders",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Folders",],
            transformErrorResponse: (response) => formatError(response),
        }),

        updateFolder: builder.mutation<IQueryResponse<IFolder>, Partial<IFolder>>({
            query: (body) => ({
                url: `/documents/folders/${body._id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Folders", "Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),

        deleteFolder: builder.mutation<IQueryResponse<null>, string>({
            query: (folderId) => ({
                url: `/documents/folders/${folderId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Folders", "Documents",],
            transformErrorResponse: (response) => formatError(response),
        }),

        // Folder metrics
        getFolderMetrics: builder.query<IQueryResponse<IFolder[]>, void>({
            query: () => "/documents/metrics",
            providesTags: ["Folders", "Documents"],
            transformErrorResponse: (response) => formatError(response),
        }),


    }),
});

export const {
    // Document hooks
    useGetDocumentsQuery,
    useGetDocumentByIdQuery,
    useCreateDocumentsMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentsMutation,
    useDeleteDocumentMutation,
    useMoveDocumentsMutation,

    // Folder hooks
    useGetFoldersQuery,
    useGetFolderByIdQuery,
    useGetFolderDocumentsQuery,
    useCreateFolderMutation,
    useUpdateFolderMutation,
    useDeleteFolderMutation,

    // Metrics hooks
    useGetFolderMetricsQuery,


} = documentsApi;