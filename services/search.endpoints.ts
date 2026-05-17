// services/search.endpoints.ts
import { api } from "./api";

export interface ISearchResult {
  type: string;
  id: string;
  title: string;
  description?: string;
  image?: string;
  url: string;
  date?: string;
  relevance: number;
  metadata?: any;
}

interface QuickSearchResult {
  type: string;
  label: string;
  value: string;
  url: string;
  image?: string;
  subtitle?: string;
}

interface SearchParams {
  q: string;
  sources?: string;
  limit?: number;
  page?: number;
  fromDate?: string;
  toDate?: string;
}

export interface SearchResponse {
  success: boolean;
  data: ISearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  searchTerm: string;
}

const searchApi = api.injectEndpoints({
  endpoints: (builder) => ({
    globalSearch: builder.query<SearchResponse, SearchParams>({
      query: (params = { q: "" }) => ({
        url: "/search",
        params, // RTK Query will automatically convert this to query string
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    quickSearch: builder.query<QuickSearchResult[], string>({
      query: (q) => `/search/quick?q=${encodeURIComponent(q)}`,
      keepUnusedDataFor: 60, // Cache for 1 minute
    }),
  }),
});

export const {
  useGlobalSearchQuery,
  useQuickSearchQuery,
  useLazyGlobalSearchQuery,
  useLazyQuickSearchQuery,
} = searchApi;
