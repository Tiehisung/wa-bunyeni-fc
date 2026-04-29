
import { EColor } from '@/types/color';
import { EPlayerPosition, } from '@/types/player.interface';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TProvider = 'local' | 'google' | 'facebook' | 'linkedin';

interface PostPlayer {
    number: number | string;
    about?: string;
    description?: string;
    firstName: string;
    lastName: string;
    dateSigned: string;
    phone: string;
    email: string;
    dob: string;
    height: string;
    avatar: string
    localAvatar: string | File
    jersey: string | number;
    manager: { fullname: string, phone: string };
    position: EPlayerPosition;
    favColor?: EColor
}

export interface UserState {
    player: PostPlayer | null

}

const initialState: UserState = {
    player: null

};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<Partial<PostPlayer>>) => {
            state.player = { ...state.player, ...action.payload } as PostPlayer;
        },

        clearPlayer: (state) => {
            state.player = null;
        },

    },
});

export const { setPlayer, clearPlayer } = playerSlice.actions;
export default playerSlice.reducer;
