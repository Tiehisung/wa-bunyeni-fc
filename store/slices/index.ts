import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Initial state with proper type
const initialState = {
    player: {},
    squad: {},
    gallery: {},

    news: {},
};

const tempSlice = createSlice({
    name: 'tempData',
    initialState,
    reducers: {
        // Merge in partial updates
        setTempData(
            state,
            action: PayloadAction<{ field: keyof typeof initialState; data: any }>
        ) {
            state[action.payload.field] = {
                ...action.payload.data,
            };
            return state;
        },

        // Reset a specific field
        resetTempData(
            state,
            action: PayloadAction<{ field: keyof typeof initialState }>
        ) {
            const { field } = action.payload;
            delete state[field];
        },

        // Clear all fields
        clearTempData(state) {
            Object.keys(state).forEach((key) => {
                delete state[key as keyof typeof initialState];
            });
        },
    },
});

// Export actions and reducer
export const { setTempData, resetTempData, clearTempData } = tempSlice.actions;

export default tempSlice.reducer;
