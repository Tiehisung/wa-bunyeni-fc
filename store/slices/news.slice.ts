
import { IPostNews } from '@/types/news.interface';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TProvider = 'local' | 'google' | 'facebook' | 'linkedin';

export interface NewsState {
    news: IPostNews | null
}

const initialState: NewsState = {
    news: null
};

const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        setNews: (state, action: PayloadAction<Partial<IPostNews>>) => {
            state.news = { ...state.news, ...action.payload } as IPostNews;
        },

        clearNews: (state) => {
            state.news = null;
        },
    },
});

export const { setNews, clearNews } = newsSlice.actions;
export default newsSlice.reducer;
