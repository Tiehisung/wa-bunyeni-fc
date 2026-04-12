import type { IUser } from '@/types/user';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TProvider = 'local' | 'google' | 'facebook' | 'linkedin';
 
export interface UserState {
  currentUser: Partial<IUser> | null;
}

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<IUser>>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },

    clearUser: (state) => {
      state.currentUser = null;
    },
    
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
