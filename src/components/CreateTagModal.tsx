// src/components/CreateTagModal.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTag, removeTag } from '../features/tag/tagSlice';
import { RootState } from '../app/store';

interface CreateTagModalProps {
    onClose: () => void;
}

const CreateTagModal: React.FC<CreateTagModalProps> = ({ onClose }) => {
    const dispatch = useDispatch();
    const tags = useSelector((state: RootState) => state.tag.tags);

    const [newTagName, setNewTagName] = useState('');

    const handleAddTag = () => {
        if (newTagName.trim() !== '') {
            dispatch(addTag({ id: Date.now(), name: newTagName, pinNotes: [] }));
            setNewTagName('');
            onClose(); // 모달 닫기
        }
    };

    const handleRemoveTag = (tagId: number) => {
        dispatch(removeTag(tagId));
        onClose(); // 모달 닫기
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Tag</h2>
                <input
                    type="text"
                    placeholder="New Tag Name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                />
                <button onClick={handleAddTag}>Add Tag</button>
                <div className="existing-tags">
                    <h3>Existing Tags</h3>
                    {tags.map((tag) => (
                        <div key={tag.id} className="tag-item">
                            {tag.name}
                            <button onClick={() => handleRemoveTag(tag.id)}>Remove</button>
                        </div>
                    ))}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default CreateTagModal;
