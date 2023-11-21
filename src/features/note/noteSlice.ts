// src/features/note/noteSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Note, NoteTag} from '../../models';

interface NotesState {
    notes: Note[];
    noteTags: NoteTag[]; // 추가된 부분
}

const initialState: NotesState = {
    notes: [],
    noteTags: [], // 추가된 부분
};


const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<Note>) => {
            state.notes.push(action.payload);
        },
        addNoteToTag: (state, action: PayloadAction<{ noteId: number; tagId: number }>) => {
            const { noteId, tagId } = action.payload;
            state.noteTags.push({ noteId, tagId });
        },
        removeNoteFromTag: (state, action: PayloadAction<{ noteId: number; tagId: number }>) => {
            const { noteId, tagId } = action.payload;
            state.noteTags = state.noteTags.filter((noteTag) => !(noteTag.noteId === noteId && noteTag.tagId === tagId));
        },
        // Other note-related actions can be defined here
    },
});

export const { addNote, addNoteToTag, removeNoteFromTag } = noteSlice.actions;
export default noteSlice.reducer;
