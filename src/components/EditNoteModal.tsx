import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {addNoteToTag, removeNoteFromTag, updateNote} from '../features/note/noteSlice';
import { Tag, NoteTag, Note } from '../models';
import SelectTagModal from './SelectTagModal';
import '../styles/EditNoteModal.css';

interface EditNoteModalProps {
    selectedNote: Note;
    noteTags: NoteTag[];
    tags: Tag[];
    onClose: () => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ onClose, selectedNote, noteTags, tags }) => {
    const dispatch = useDispatch();

    const [newNoteTitle, setNewNoteTitle] = useState(selectedNote.title);
    const [newNoteContent, setNewNoteContent] = useState(selectedNote.content);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [priority, setPriority] = useState<string>(selectedNote.priority);
    const [color, setColor] = useState<string>(selectedNote.color);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(
        tags.filter((tag) => noteTags.some((noteTag) => noteTag.tagId === tag.id))
    );

    const handleEditNote = () => {
        const editedNote: Note = {
            id: selectedNote.id,
            title: newNoteTitle || selectedNote.title,
            content: newNoteContent || selectedNote.content,
            priority,
            color,
            editTime: Date.now(),
        };

        dispatch(updateNote(editedNote));

        // 기존에 연결된 태그들을 먼저 제거
        noteTags
            .filter((nt) => nt.noteId === selectedNote.id)
            .forEach((nt) => dispatch(removeNoteFromTag(nt)));

        // 수정된 태그들을 새로 추가
        selectedTags.forEach((tag) => {
            const noteTag: NoteTag = {
                noteId: editedNote.id,
                tagId: tag.id,
            };
            dispatch(addNoteToTag(noteTag));
        });

        // 입력값 초기화하고 모달 닫기
        setNewNoteTitle('');
        setNewNoteContent('');
        setSelectedTags([]);
        onClose();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleTagSelection = (tag: Tag) => {
        // 이미 선택된 태그라면 제외하고, 아니라면 추가
        if (selectedTags.some((selectedTag) => selectedTag.id === tag.id)) {
            setSelectedTags((prevSelectedTags) => prevSelectedTags.filter((t) => t.id !== tag.id));
        } else {
            setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tag]);
        }
    };

    return (
        <div className="edit-note-modal">
            <div className="edit-note-modal-container">
                <h2>Edit Note</h2>
                <div className="edit-note-modal-content-box">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                    />
                    <textarea
                        style={{ background: getBackgroundColor(color) }}
                        placeholder="Content"
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                    />
                </div>
                <div className="edit-note-modal-tags">
                    {selectedTags.map((tag) => (
                        <div className="edit-note-modal-tag" key={tag.id}>
                            <span>{tag.name}</span>
                            <button onClick={() => handleTagSelection(tag)}>x</button>
                        </div>
                    ))}
                </div>
                <div className="edit-note-modal-props">
                    <button className="edit-note-modal-select" onClick={openModal}>
                        Add Tag
                    </button>
                    <label>
                        Color:
                        <select value={color} onChange={(e) => setColor(e.target.value)}>
                            <option value="White">White</option>
                            <option value="Red">Red</option>
                            <option value="Green">Green</option>
                            <option value="Blue">Blue</option>
                        </select>
                    </label>
                    <label>
                        Priority:
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="High">High</option>
                            <option value="Low">Low</option>
                        </select>
                    </label>
                </div>
                <div className="edit-note-modal-buttons">
                    <button className="edit-note-modal-add" onClick={handleEditNote}>
                        Edit Note
                    </button>
                    <button className="edit-note-modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>

                {isModalOpen && <SelectTagModal onClose={closeModal} onSelectTag={handleTagSelection} selectedTags={selectedTags} />}
            </div>
        </div>
    );
};

export default EditNoteModal;

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
