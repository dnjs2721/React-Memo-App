// src/components/Navigation.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import '../styles/Navigation.css';
import CreateTagModal from './CreateTagModal';
import {selectTag} from '../features/tag/tagSlice';

const Navigation: React.FC = () => {
    const dispatch = useDispatch();
    const tags = useSelector((state: RootState) => state.tag.tags);
    const archiveTag = useSelector((state: RootState) => state.tag.archiveTag);
    const trashTag = useSelector((state: RootState) => state.tag.trashTag);
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
                <h2 className={"navigation-container-title"}
                    onClick={() => handleTagClick(null)}
                >Keep</h2>
                <div className="tag-list">
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            className={`tag-item ${selectedTagId === tag.id 
                                ? 'selected' 
                                : ''}`}
                            onClick={() => handleTagClick(tag.id)}
                        >
                            <img
                                src={tag.img}
                                alt={"img"}
                            />
                            <p>{tag.name}</p>
                        </div>
                    ))}
                </div>
                <div className="tag-creator">
                    <div className={"tag-creator-button"}
                         onClick={openModal}
                    >
                        <img
                            alt={"img"}
                            src="/edit.png"
                        />
                        <p>Edit Tags</p>
                    </div>
                </div>
                <div className="tag-list">
                    <div
                        className={`tag-item ${selectedTagId === archiveTag.id
                            ? 'selected'
                            : ''}`}
                        onClick={() => handleTagClick(archiveTag.id)}
                    >
                        <img
                            src={archiveTag.img}
                            alt={"img"}
                        />
                        <p>Archive</p>
                    </div>
                    <div
                        className={`tag-item ${selectedTagId === trashTag.id
                            ? 'selected'
                            : ''}`} onClick={() => handleTagClick(trashTag.id)}
                    >
                        <img
                            src={trashTag.img}
                            alt={"img"}
                        />
                        <p>Trash</p>
                    </div>
                </div>

                {isModalOpen && <CreateTagModal onClose={closeModal} />}
            </div>
        </div>
    );
};

export default Navigation;
