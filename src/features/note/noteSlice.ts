// src/features/note/noteSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Note, NoteTag} from '../../models';

interface NotesState {
    notes: Note[];
    noteTags: NoteTag[];
}

const initialState: NotesState = {
    notes: [],
    noteTags: [],
};


const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<Note>) => {
            state.notes.push(action.payload);
        },
        removeNote: (state, action: PayloadAction<number>) => {
            const noteIdToRemove = action.payload;
            // Remove the note from the notes array
            state.notes = state.notes.filter((note) => note.id !== noteIdToRemove);
            // Remove any note tags associated with the removed note
            state.noteTags = state.noteTags.filter((noteTag) => noteTag.noteId !== noteIdToRemove);
        },
        updateNote: (state, action: PayloadAction<Note>) => {
            const updatedNote = action.payload;
            const index = state.notes.findIndex((note) => note.id === updatedNote.id);

            if (index !== -1) {
                state.notes[index] = updatedNote;
            }
        },
        addNoteToTag: (state, action: PayloadAction<{ noteId: number; tagId: number }>) => {
            const { noteId, tagId } = action.payload;
            state.noteTags.push({ noteId, tagId });
        },
        removeNoteFromTag: (state, action: PayloadAction<{ noteId: number; tagId: number }>) => {
            const { noteId, tagId } = action.payload;
            state.noteTags = state.noteTags.filter((noteTag) => !(noteTag.noteId === noteId && noteTag.tagId === tagId));
        },
    },
});

export const { addNote, removeNote, updateNote, addNoteToTag, removeNoteFromTag } = noteSlice.actions;
export default noteSlice.reducer;
