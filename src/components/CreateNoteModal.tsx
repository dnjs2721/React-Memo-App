// src/components/CreateNoteModal.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNote, addNoteToTag } from '../features/note/noteSlice';
import { Tag, NoteTag } from '../models';
import SelectTagModal from './SelectTagModal'; // 새로운 모달 컴포넌트를 가져왔어요
import '../styles/CreateNoteModal.css'

interface CreateNoteModalProps {
    selectedTag: Tag;
    onClose: () => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ onClose, selectedTag }) => {
    const dispatch = useDispatch();

    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([selectedTag]);
    const [priority, setPriority] = useState<string>('Low');
    const [color, setColor] = useState<string>('White');

    const handleAddNote = () => {
        const newNote = {
            id: Date.now(),
            title: newNoteTitle || `New Note`,
            content: newNoteContent || 'Type your content here',
            priority: priority,
            color: color
        };

        dispatch(addNote(newNote));

        // 수정: 선택된 태그에 새로운 노트를 추가할 수도 있어요.
        selectedTags.forEach((tag) => {
            const noteTag: NoteTag = {
                noteId: newNote.id,
                tagId: tag.id,
            };
            dispatch(addNoteToTag(noteTag));
        });

        // 입력값 초기화하고 모달 닫기
        setNewNoteTitle('');
        setNewNoteContent('');
        setSelectedTags([]); // 수정: 선택된 태그들 초기화
        onClose();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleTagSelection = (tag: Tag) => {
        // 수정: 선택된 태그 처리
        // 이미 선택된 태그라면 제외하고, 아니라면 추가
        if (selectedTags.some((selectedTag) => selectedTag.id === tag.id)) {
            setSelectedTags((prevSelectedTags) => prevSelectedTags.filter((t) => t.id !== tag.id));
        } else {
            setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
        }

        // setIsModalOpen(false);
    };


    return (
        <div className={"create-note-modal"}>
            <div className="create-note-modal-container">
                <h2>Add New Note</h2>
                <div className={"create-note-modal-content-box"}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                    />
                    <textarea
                        // className={"create-note-modal-content"}
                        style={{ background: getBackgroundColor(color) }}
                        placeholder="Content"
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                    />
                </div>
                <div className={"create-note-modal-tags"}>
                    {/* 수정: 선택된 태그들의 이름을 보여줌 */}
                    {selectedTags.map((tag) => (
                        <div
                            className={"create-note-modal-tag"}
                            key={tag.id}
                        >
                            <span>{tag.name}</span>
                            <button onClick={() => handleTagSelection(tag)}>x</button>
                        </div>
                    ))}
                </div>
                <div className={"create-note-modal-props"}>
                    <button className={"create-note-modal-select"} onClick={openModal}>Add Tag</button>
                    <label>
                        베경색 :
                        <select value={color} onChange={(e) => setColor(e.target.value)}>
                            <option value="White">White</option>
                            <option value="Red">Red</option>
                            <option value="Green">Green</option>
                            <option value="Blue">Blue</option>
                        </select>
                    </label>
                    <label>
                        우선순위 :
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                        </select>
                    </label>
                </div>
                <div className={"create-note-modal-buttons"}>
                    <button className={"create-note-modal-add"} onClick={handleAddNote}>Add Note</button>
                    <button className={"create-note-modal-cancel"} onClick={onClose}>Cancel</button>
                </div>

                {isModalOpen && <SelectTagModal onClose={closeModal} onSelectTag={handleTagSelection} selectedTags={selectedTags}/>}
            </div>
        </div>
    );
};

export default CreateNoteModal;

function getBackgroundColor(color: string) {
    switch (color) {
        case 'Red':
            return 'pink';
        case 'Blue':
            return 'lightblue';
        case 'Green':
            return 'lightgreen';
        default:
            return '#fff'; // 기본값은 흰색으로 설정
    }
}
