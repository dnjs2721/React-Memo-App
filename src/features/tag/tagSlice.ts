// src/features/tag/tagSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NoteTag, Tag} from '../../models';

interface TagsState {
    tags: Tag[];
    selectedTagId: number | null;
    selectedTag: Tag | null;
    // 추가된 부분
    noteTags: NoteTag[];
}

const initialState: TagsState = {
    tags: [
        { id: Date.now(), name: 'Notes', pinNotes: [] },
        { id: Date.now()+1, name: 'Coding', pinNotes: [] },
        { id: Date.now()+2, name: 'Exercise', pinNotes: [] },
    ],
    selectedTagId: null,
    selectedTag: null,
    noteTags: []
};

const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        addTag: (state, action: PayloadAction<Tag>) => {
            state.tags.push(action.payload);
        },
        removeTag: (state, action: PayloadAction<number>) => {
            state.tags = state.tags.filter((tag) => tag.id !== action.payload);
        },
        selectTag: (state, action: PayloadAction<number | null>) => {
            state.selectedTagId = action.payload;

            // 변경된 부분
            const selectedTag = state.tags.find((tag) => tag.id === action.payload);
            state.selectedTag = selectedTag || null;
        },
        addTagToNote: (state, action: PayloadAction<{ noteId: number; tagId: number }>) => {
            // 변경된 부분
            state.noteTags.push(action.payload);
        },
        removeTagFromNote: (state, action: PayloadAction<{ noteId: number; tagId: number }>) => {
            // 변경된 부분
            state.noteTags = state.noteTags.filter(
                (noteTag) => !(noteTag.noteId === action.payload.noteId && noteTag.tagId === action.payload.tagId)
            );
        },
        pinNote: (state, action: PayloadAction<{ tagId: number; noteId: number }>) => {
            const { tagId, noteId } = action.payload;
            const tag = state.tags.find((tag) => tag.id === tagId);

            if (tag) {
                // Check if the noteId is already in pinNotes
                const existingIndex = tag.pinNotes.indexOf(noteId);

                if (existingIndex !== -1) {
                    // If noteId exists, remove it
                    tag.pinNotes = tag.pinNotes.filter((id:number) => id !== noteId);
                } else {
                    // If noteId doesn't exist, add it
                    tag.pinNotes = [...tag.pinNotes, noteId];
                }
            }
        },
    },
});

export const { addTag, removeTag, selectTag, addTagToNote, removeTagFromNote, pinNote } = tagsSlice.actions;
export default tagsSlice.reducer;
