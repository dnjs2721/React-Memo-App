// src/components/NoteList.tsx

import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../app/store';
import {Note, NoteTag, Tag} from '../models';
import CreateNoteModal from './CreateNoteModal';
import '../styles/NoteList.css';
import SortNotesModal from './SortNotesModal';
import {pinNote, selectTag} from "../features/tag/tagSlice";

const NoteList: React.FC = () => {
    const dispatch = useDispatch();
    const selectedTag = useSelector<RootState, Tag | null>((state) => state.tag.selectedTag);
    const pinNotes = useSelector<RootState, number[] | null>((state) => state.tag.selectedTag?.pinNotes || null);
    const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);

    const notes = useSelector<RootState, Note[]>((state) => state.note.notes);
    const noteTags = useSelector<RootState, NoteTag[]>((state) => state.note.noteTags);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);
    const [sortOption, setSortOption] = useState<string>('');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openSortModal = () => {
        setIsSortModalOpen(true);
    };

    const closeSortModal = () => {
        setIsSortModalOpen(false);
    };

    const handleSort = (sortOption: string) => {
        setSortOption(sortOption);
    };

    const filteredNotes = selectedTag
        ? notes.filter((note) => noteTags.some((noteTag) => noteTag.tagId === selectedTag.id && noteTag.noteId === note.id))
        : notes;

    // 정렬된 노트 리스트 가져오기
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        switch (sortOption) {
            case 'id-desc':
                return b.id - a.id;
            case 'id-asc':
                return a.id - b.id;
            case 'priority-desc':
                // Low -> High
                return getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
            case 'priority-asc':
                // High -> Low
                return getPriorityOrder(b.priority) - getPriorityOrder(a.priority);
            default:
                return 0;
        }
    });

    const pinnedNotes = sortedNotes.filter(note => pinNotes?.includes(note.id));
    const unpinnedNotes = sortedNotes.filter(note => !pinNotes?.includes(note.id));

    const handlePinNote = (noteId: number) => {
        if (selectedTag) {
            // pinNote 액션 디스패치
            dispatch(pinNote({ tagId: selectedTag.id, noteId }))
            dispatch(selectTag(selectedTag.id));
        }
    };

    function getTagNameById(tagId: number): string | undefined {
        const tag = tags.find((tag) => tag.id === tagId);
        return tag ? tag.name : undefined;
    }

    const element = (note: Note) => (
        <div
            key={note.id}
            className={"note-item"}
            style={{background: getBackgroundColor(note.color)}}
        >
            <div className={"note-item-header"}>
                <strong className={"note-item-header-title"}>{note.title}</strong>
                <div className={"note-item-header-right"}>
                    <p className={"note-item-priority"}>{note.priority}</p>
                    <button
                        className={"note-item-pin"}
                        onClick={() => handlePinNote(note.id)}
                    >pin
                    </button>
                </div>
            </div>
            <div className={"note-item-content-box"}>
                <p className={"note-item-content"}>{note.content}</p>
            </div>
            <div className={"note-item-tags"}>
                {noteTags
                    .filter((noteTag) => noteTag.noteId === note.id)
                    .map((noteTag) => (
                        <div key={noteTag.tagId}>{getTagNameById(noteTag.tagId)}</div>
                    ))}
            </div>
            <div className={"note-item-footer"}>
                <p className={"note-item-id"}>{formatDate(note.id)}</p>
                <button className={"note-item-edit-button"}>edit</button>
                <button className={"note-item-delete-button"}>delete</button>
            </div>
        </div>
    );

    return (
        <div className="note-list">
            {selectedTag ? (
                <div>
                    <div className={"header"}>
                        <h2>{selectedTag.name}</h2>
                        <button onClick={openModal}>Edit</button>
                    </div>
                    {filteredNotes.length !== 0 ? (
                        <div>
                            <input className={"search-bar"}/>
                            <div>
                                <button onClick={openSortModal}>Sort</button>
                            </div>

                            <div className="note-list-container">
                                {pinnedNotes.length !== 0 && (
                                    <div>
                                        <div className={"note-list-container-title"}>
                                            <h3>Pinned Notes</h3>
                                            <p>({pinnedNotes.length})</p>
                                        </div>
                                        <div className={"pin-note-items"}>
                                            {pinnedNotes.map(element)}
                                        </div>
                                    </div>
                                )}
                                <div className={"note-list-container-title"}>
                                    <h3>All Notes</h3>
                                    <p>({unpinnedNotes.length})</p>
                                </div>
                                <div className={"unpin-note-items"}>
                                    {unpinnedNotes.map(element)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>노트가 없습니다.</p>
                        </div>
                    )}

                    {isModalOpen && <CreateNoteModal onClose={closeModal} selectedTag={selectedTag}/>}
                    {isSortModalOpen && <SortNotesModal onClose={closeSortModal} onSort={handleSort}/>}
                </div>
            ) : (
                <p>No tag selected</p>
            )}
        </div>
    );
};

export default NoteList;

function getPriorityOrder(priority: string): number {
    const priorityOrder = ['High', 'Low'];
    return priorityOrder.indexOf(priority);
}

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

function formatDate(timestamp:number) {
    const date = new Date(timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${(date.getFullYear() % 100).toString().padStart(2, '0')} ${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'pm' : 'am'}`;
}