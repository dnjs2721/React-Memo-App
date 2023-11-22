// src/components/SelectTagModal.tsx

import React, {useMemo, useState} from 'react';
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
    const archiveTag = useSelector<RootState, Tag>((state) => state.tag.archiveTag);

    const memoizedTags = useMemo(() => {
        return [...tags, archiveTag];
    }, [tags, archiveTag]);

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

    return (
        <div className={"select-tag-modal"}>
            <div className={"select-tag-modal-container"}>
                <div className={"select-tag-modal-container-header"}>
                    <h2>Select a Tag</h2>
                    <button onClick={onClose}>X</button>
                </div>
                <div className={"select-tag-modal-container-newTag"}>
                    <input
                        className={"select-tag-modal-container-newTag-input"}
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
                <div className={"select-tag-modal-container-tags"}>
                    {memoizedTags.map((tag) => (
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
