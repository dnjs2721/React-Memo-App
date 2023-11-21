// src/components/SelectTagModal.tsx

import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '../app/store';
import { Tag } from '../models';
import {addTag} from "../features/tag/tagSlice";
import '../styles/SelectTagModal.css'

interface SelectTagModalProps {
    onClose: () => void;
    onSelectTag: (tag: Tag) => void;
    selectedTags: Tag[];
}


const SelectTagModal: React.FC<SelectTagModalProps> = ({ onClose, onSelectTag, selectedTags }) => {
    const dispatch = useDispatch();
    const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);

    const [newTagName, setNewTagName] = useState('');

    const handleAddTag = () => {
        if (newTagName.trim() !== '') {
            dispatch(addTag({ id: Date.now(), name: newTagName, pinNotes: [] }));
            setNewTagName('');
        }
    };

    return (
        <div className={"select-tag-modal"}>
            <div className={"select-tag-modal-container"}>
                <div className={"select-tag-modal-container-header"}>
                    <h2>Select a Tag</h2>
                    <button onClick={onClose}>X</button>
                </div>
                <div className={"select-tag-modal-container-newTag"}>
                    <input
                        type="text"
                        placeholder="New Tag Name"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddTag();
                            }
                        }}
                    />
                </div>
                <div className={"select-tag-modal-container-tags"}>
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className={"select-tag-modal-container-tag"}
                        >
                            <p>{tag.name}</p>
                            {selectedTags.includes(tag) ? (
                                <button onClick={() => onSelectTag(tag)}>-</button>
                            ) : (
                                <button onClick={() => onSelectTag(tag)}>+</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectTagModal;
