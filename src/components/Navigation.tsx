// src/components/Navigation.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import '../styles/Navigation.css';
import CreateTagModal from './CreateTagModal';
import { selectTag } from '../features/tag/tagSlice';

const Navigation: React.FC = () => {
    const dispatch = useDispatch();
    const tags = useSelector((state: RootState) => state.tag.tags); // Fixed
    const [isModalOpen, setIsModalOpen] = useState(false);
    const selectedTagId = useSelector<RootState, number | null>((state) => state.tag.selectedTagId);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleTagClick = (tagId: number | null) => {
        dispatch(selectTag(tagId));
    };

    return (
        <div className="navigation">
            <div className={"navigation-container"}>
                <h2
                    onClick={() => handleTagClick(null)}
                >Keep</h2>
                <div className="tag-list">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className={`tag-item ${selectedTagId === tag.id 
                                ? 'selected' 
                                : ''}`} onClick={() => handleTagClick(tag.id)}
                        >{tag.name}
                        </div>
                    ))}
                </div>
                <div className="tag-creator">
                    <button onClick={openModal}>Edit</button>
                </div>
                <div className="fixed-tags">
                    <div className="tag-item">Archive</div>
                    <div className="tag-item">Trash</div>
                </div>

                {isModalOpen && <CreateTagModal onClose={closeModal} />}
            </div>
        </div>
    );
};

export default Navigation;
