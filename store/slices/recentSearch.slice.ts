// store/slices/recentSearchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRecentSearch {
    id: string;
    query: string;
    type?: string;
    url?: string;
    timestamp: number;
}

interface RecentSearchState {
    searches: IRecentSearch[];
    maxItems: number;
}

const initialState: RecentSearchState = {
    searches: [],
    maxItems: 5,
};

export const recentSearchSlice = createSlice({
    name: "recentSearches",
    initialState,
    reducers: {
        addRecentSearch: (state, action: PayloadAction<Omit<IRecentSearch, "id" | "timestamp">>) => {
            const newSearch: IRecentSearch = {
                ...action.payload,
                id: `${Date.now()}-${action.payload.query}`,
                timestamp: Date.now(),
            };

            // Remove duplicate if exists
            const filtered = state.searches.filter(s => s.query !== action.payload.query);

            // Add new at the beginning and limit to maxItems
            state.searches = [newSearch, ...filtered].slice(0, state.maxItems);
        },

        removeRecentSearch: (state, action: PayloadAction<string>) => {
            state.searches = state.searches.filter(s => s.id !== action.payload);
        },

        clearAllRecentSearches: (state) => {
            state.searches = [];
        },

        updateMaxItems: (state, action: PayloadAction<number>) => {
            state.maxItems = action.payload;
            state.searches = state.searches.slice(0, state.maxItems);
        },
    },
});

export const {
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
    updateMaxItems,
} = recentSearchSlice.actions;

export default recentSearchSlice.reducer;