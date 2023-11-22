// src/components/CreateTagModal.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {addTag, removeTag, unPinNote} from '../features/tag/tagSlice';
import { RootState } from '../app/store';
import '../styles/CreateTagModal.css'
import {Note, NoteTag, Tag} from "../models";
import {addNoteToTag, removeNoteFromTag} from "../features/note/noteSlice";

interface CreateTagModalProps {
    onClose: () => void;
}

const CreateTagModal: React.FC<CreateTagModalProps> = ({ onClose }) => {
    const dispatch = useDispatch();
    const tags = useSelector((state: RootState) => state.tag.tags);
    const notes = useSelector<RootState, Note[]>((state) => state.note.notes);

    const noteTags = useSelector<RootState, NoteTag[]>((state) => state.note.noteTags);

    const trashTag = useSelector<RootState, Tag>((state) => state.tag.trashTag);

    const [newTagName, setNewTagName] = useState('');

    const handleAddTag = () => {
        if (tags.some((tag) => tag.name === newTagName)) {
            // 이미 존재하는 태그명이라면 얼럿을 띄움
            alert('이미 존재하는 태그명입니다.');
            setNewTagName('');
            return;
        }
        if (newTagName.trim() !== '') {
            dispatch(addTag({ id: Date.now(), name: newTagName, pinNotes: [], img: "/tag.png" }));
            setNewTagName('');
        }
    };

    const handleRemoveTag = (tagId: number) => {
        const noteTagsForTag = noteTags.filter((nt) => nt.tagId === tagId);

        noteTagsForTag.forEach((nt) => {
            const otherTags = noteTags.filter((otherNt) => otherNt.noteId === nt.noteId && otherNt.tagId !== tagId);

            // Check if the note is shared with other tags
            if (otherTags.length === 0) {
                const noteTag: NoteTag = {
                    noteId: nt.noteId,
                    tagId: trashTag.id,
                };

                dispatch(removeNoteFromTag(nt));
                dispatch(unPinNote(nt));
                dispatch(addNoteToTag(noteTag));
            } else {
                // If the note is shared with other tags, just remove the current tag
                dispatch(removeNoteFromTag(nt));
                dispatch(unPinNote(nt));
            }
        });

        dispatch(removeTag(tagId));
    };

    return (
        <div className="create-tag-modal">
            <div className="create-tag-modal-container">
                <div className={"create-tag-modal-container-header"}>
                    <h2>Edit Tags</h2>
                    <button onClick={onClose}>X</button>
                </div>
                <div className={"create-tag-modal-container-newTag"}>
                    <input
                        className={"create-tag-modal-container-newTag-input"}
                        type="text"
                        placeholder="New Tag Name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleAddTag();
                            }
                        }}
                    />
                </div>
                <div className="create-tag-modal-container-tags">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className={"create-tag-modal-container-tag"}
                        >
                            <p>{tag.name}</p>
                            <button onClick={() => handleRemoveTag(tag.id)}>X</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateTagModal;
