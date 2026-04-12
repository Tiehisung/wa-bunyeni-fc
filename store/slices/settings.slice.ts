import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IinitState {
  displayType: 'grid' | 'list';
  news: Record<string, any>;
  player: Record<string, any>;
   
}
// Initial state with proper type
const initialState: IinitState = {
  displayType: 'grid',
 

  //not implemented
  news: {},
  player: {},
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Merge in partial updates
    setSettings<K extends keyof IinitState>(
      state: IinitState,
      action: PayloadAction<{ field: K; data: IinitState[K] }>
    ) {
      const { field, data } = action.payload;

      if (Array.isArray(data)) {
        state[field] = [...data] as any;
      } else if (typeof data === "object" && data !== null) {
        state[field] = { ...data } as any;
      } else {
        state[field] = data;
      }
    },

    // Reset a specific field
    resetSettings(
      state,
      action: PayloadAction<{ field: keyof typeof initialState }>
    ) {
      const { field } = action.payload;
      delete state[field];
    },

    // Clear all fields
    clearSettings(state) {
      Object.keys(state).forEach((key) => {
        delete state[key as keyof typeof initialState];
      });
    },
  },
});

// Export actions and reducer
export const { setSettings, resetSettings, clearSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
