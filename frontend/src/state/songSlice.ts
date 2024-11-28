import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Song {
    id: number;
    track_name: string;
    url: string;
}

interface SongSliceState {
    songs: Song[];
}

const initialState: SongSliceState = {
    songs: []
};

const songSlice = createSlice({
    name: 'songs',
    initialState,
    reducers: {
        addSong: (state, action: PayloadAction<Song>) => {
            state.songs = [...state.songs, action.payload];
        },
        updateSong: (state, action: PayloadAction<Song>) => {
            const { id } = action.payload;
            const songIndex = state.songs.findIndex(song => song.id === id);
            if (songIndex !== -1) {
                state.songs[songIndex] = action.payload;
            }
        },
        deleteSong: (state, action: PayloadAction<number>) => {
            const index = state.songs.findIndex(song => song.id === action.payload);
            if (index !== -1) {
                state.songs.splice(index, 1);
            }
        }
    }
});

export const { addSong, updateSong, deleteSong } = songSlice.actions;

export default songSlice.reducer;