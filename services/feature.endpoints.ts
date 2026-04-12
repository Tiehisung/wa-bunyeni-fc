// feature.endpoint.ts
import type { IQueryResponse, ISelectOptionLV } from "@/types";
import { api } from "./api";

export interface IFeature<T = ISelectOptionLV[]> {
    _id?: string;
    name: string;
    data: T;
}

const featureApi = api.injectEndpoints({
    endpoints: (builder) => ({

        // GET all features
        getFeatures: builder.query<IQueryResponse<IFeature[]>, void>({
            query: () => "/features",
            providesTags: ["Features"],
        }),

        // GET feature by name
        getFeatureByName: builder.query<IQueryResponse<IFeature>, string>({
            query: (name) => `/features/name/${name}`,
            providesTags: ["Features"],
        }),

        // GET features by category
        getFeaturesByCategory: builder.query<IQueryResponse<IFeature[]>, string>({
            query: (category) => `/features/category/${category}`,
            providesTags: ["Features"],
        }),

        // CHECK feature status (is enabled/disabled)
        checkFeatureStatus: builder.query<IQueryResponse<{ enabled: boolean }>, string>({
            query: (name) => `/features/${name}/status`,
            providesTags: ["Features"],
        }),

        // GET feature statistics
        getFeatureStats: builder.query<IQueryResponse<any>, void>({
            query: () => "/features/stats",
            providesTags: ["Features"],
        }),

        // CREATE feature
        createFeature: builder.mutation<IQueryResponse<IFeature>, Partial<IFeature>>({
            query: (body) => ({
                url: "/features",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Features"],
        }),

        // UPDATE feature by ID
        updateFeature: builder.mutation<IQueryResponse<IFeature>, Partial<IFeature> >({
            query: (data) => ({
                url: `/features/${data?._id}`,
                method: "PUT",
                body:data,
            }),
            invalidatesTags: ["Features"],
        }),

        // UPDATE feature by name
        updateFeatureByName: builder.mutation<IQueryResponse<IFeature>, { name: string; body: Partial<IFeature> }>({
            query: ({ name, body }) => ({
                url: `/features/name/${name}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Features"],
        }),

        // TOGGLE feature status (enable/disable)
        toggleFeatureStatus: builder.mutation<IQueryResponse<IFeature>, {
            id?: string;
            name?: string;
            enabled: boolean;
        }>({
            query: ({ id, name, enabled }) => ({
                url: id ? `/features/${id}/toggle` : `/features/name/${name}/toggle`,
                method: "PATCH",
                body: { enabled },
            }),
            invalidatesTags: ["Features"],
        }),

        // DELETE feature by ID
        deleteFeature: builder.mutation<IQueryResponse<IFeature>, string>({
            query: (id) => ({
                url: `/features/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Features"],
        }),

        // DELETE feature by name
        deleteFeatureByName: builder.mutation<IQueryResponse<IFeature>, string>({
            query: (name) => ({
                url: `/features/name/${name}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Features"],
        }),

    }),
});

export const {
    useGetFeaturesQuery,
    useGetFeatureByNameQuery,
    useGetFeaturesByCategoryQuery,
    useCheckFeatureStatusQuery,
    useGetFeatureStatsQuery,
    useCreateFeatureMutation,
    useUpdateFeatureMutation,
    useUpdateFeatureByNameMutation,
    useToggleFeatureStatusMutation,
    useDeleteFeatureMutation,
    useDeleteFeatureByNameMutation,
} = featureApi;

export default featureApi;