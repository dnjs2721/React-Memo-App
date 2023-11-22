// src/features/tag/tagSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NoteTag, Tag} from '../../models';

interface TagsState {
    tags: Tag[];
    archiveTag: Tag;
    trashTag: Tag;
    selectedTagId: number | null;
    selectedTag: Tag | null;
    noteTags: NoteTag[];
}

const initialState: TagsState = {
    tags: [
        { id: Date.now(), name: 'Notes', pinNotes: [], img: "/bulb.png" },
        { id: Date.now()+1, name: 'Coding', pinNotes: [], img: "/tag.png" },
        { id: Date.now()+2, name: 'Exercise', pinNotes: [], img: "/tag.png" },
    ],
    archiveTag: { id: 1, name: 'Archive', pinNotes: [], img: "/archive.png"},
    trashTag: { id: 2, name: 'Trash', pinNotes: [], img: "/trash.png"},
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

            if (state.selectedTagId === state.archiveTag.id) {
                state.selectedTag = state.archiveTag;
            } else if ((state.selectedTagId === state.trashTag.id)) {
                state.selectedTag = state.trashTag;
            } else {
                const selectedTag = state.tags.find((tag) => tag.id === action.payload);
                state.selectedTag = selectedTag || null;
            }
        },
        pinNote: (state, action: PayloadAction<{ tagId: number; noteId: number }>) => {
            const { tagId, noteId } = action.payload;

            let tag;
            if (tagId === state.archiveTag.id) {
                tag = state.archiveTag;
            } else {
                tag = state.tags.find((tag) => tag.id === tagId);
            }

            if (tag) {
                const existingIndex = tag.pinNotes.indexOf(noteId);

                if (existingIndex !== -1) {
                    tag.pinNotes = tag.pinNotes.filter((id:number) => id !== noteId);
                } else {
                    tag.pinNotes = [...tag.pinNotes, noteId];
                }
            }
        },
        unPinNote: (state, action: PayloadAction<{ tagId: number; noteId: number }>) => {
            const { tagId, noteId } = action.payload;

            let tag;
            if (tagId === state.archiveTag.id) {
                tag = state.archiveTag;
            } else {
                tag = state.tags.find((tag) => tag.id === tagId);
            }

            if (tag) {
                const existingIndex = tag.pinNotes.indexOf(noteId);

                if (existingIndex !== -1) {
                    tag.pinNotes = tag.pinNotes.filter((id:number) => id !== noteId);
                }
            }
        },
    },
});

export const { addTag, removeTag, selectTag, pinNote, unPinNote } = tagsSlice.actions;
export default tagsSlice.reducer;
