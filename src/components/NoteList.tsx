// src/components/NoteList.tsx

import React, {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../app/store';
import {Note, NoteTag, Tag} from '../models';
import CreateNoteModal from './CreateNoteModal';
import '../styles/NoteList.css';
import SortNotesModal from './SortNotesModal';
import {pinNote, selectTag, unPinNote} from "../features/tag/tagSlice";
import EditNoteModal from "./EditNoteModal";
import {addNoteToTag, removeNote, removeNoteFromTag} from "../features/note/noteSlice";
import MemoAppIntro from "./MemoAppIntro";

const NoteList: React.FC = () => {
    const dispatch = useDispatch();
    const selectedTag = useSelector<RootState, Tag | null>((state) => state.tag.selectedTag);
    const pinNotes = useSelector<RootState, number[] | null>((state) => state.tag.selectedTag?.pinNotes || null);
    const tags = useSelector<RootState, Tag[]>((state) => state.tag.tags);
    const archiveTag = useSelector<RootState, Tag>((state) => state.tag.archiveTag);
    const trashTag = useSelector<RootState, Tag>((state) => state.tag.trashTag);

    const memoizedTags = useMemo(() => {
        return [...tags, archiveTag];
    }, [tags, archiveTag]);

    const notes = useSelector<RootState, Note[]>((state) => state.note.notes);
    const noteTags = useSelector<RootState, NoteTag[]>((state) => state.note.noteTags);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);
    const [sortOption, setSortOption] = useState<string>('');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openEditModal = (noteId: number) => {
        setEditingNoteId(noteId);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingNoteId(null);
        setIsEditModalOpen(false);
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
            case 'edited' :
                return b.editTime - a.editTime;
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

    const handleRemoveNote = (noteId: number) => {
        if (selectedTag?.id !== trashTag.id) {
            noteTags
                .filter((nt) => nt.noteId === noteId)
                .forEach((nt) => {
                    dispatch(removeNoteFromTag(nt))
                    dispatch(unPinNote(nt));
                });
            const noteTag: NoteTag = {
                noteId: noteId,
                tagId: trashTag.id,
            };
            dispatch(addNoteToTag(noteTag));
        } else {
            dispatch(removeNote(noteId));
        }
    }

    function getTagNameById(tagId: number): string | undefined {
        const tag = memoizedTags.find((tag) => tag.id === tagId);
        return tag ? tag.name : undefined;
    }

    const element = (note: Note, pin: boolean) => (
        <div
            key={note.id}
            className={"note-item"}
            style={{background: getBackgroundColor(note.color)}}
        >
            <div className={"note-item-header"}>
                <strong className={"note-item-header-title"}>{note.title}</strong>
                <div className={"note-item-header-right"}>
                    <p className={"note-item-priority"}>{note.priority}</p>
                    {selectedTag?.id !== trashTag.id && (
                        <img
                            src={pin ? process.env.PUBLIC_URL + "/pin.png" : process.env.PUBLIC_URL + "/unpin.png"}
                            alt="pin"
                            className={"note-item-pin"}
                            onClick={() => handlePinNote(note.id)}
                        />
                    )}
                </div>
            </div>
            <div className={"note-item-content-box"}>
                <p className={"note-item-content"}>{note.content}</p>
            </div>
            {selectedTag?.id !== trashTag.id && (
                <div className={"note-item-tags"}>
                    {noteTags
                        .filter((noteTag) => noteTag.noteId === note.id)
                        .map((noteTag) => (
                            <div key={noteTag.tagId}>{getTagNameById(noteTag.tagId)}</div>
                        ))}
                </div>
            )}
            <div className={"note-item-footer"}>
                <div className={"note-item-footer-container"}>
                    <p className={"note-item-id"}>{formatDate(note.id)}</p>
                    <div>
                        <img
                            src="/editNote.png"
                            alt={"editNote"}
                            className={"note-item-edit-button"}
                            onClick={() => openEditModal(note.id)}
                        />
                        <img
                            src="/trash.png"
                            alt={"trash"}
                            className={"note-item-delete-button"}
                            onClick={() => handleRemoveNote(note.id)}
                        />
                    </div>
                </div>
            </div>

            {isEditModalOpen && editingNoteId === note.id &&
                <EditNoteModal
                    onClose={closeEditModal}
                    selectedNote={note}
                    noteTags={noteTags.filter((noteTag) => noteTag.noteId === note.id)}
                    tags={memoizedTags}
                />
            }
        </div>
    );

    return (
        <div className="note-list">
            {selectedTag ? (
                <div>
                    <div className={"header"}>
                        <h2>{selectedTag.name}</h2>
                        {selectedTag.id !== trashTag.id && (
                            <button onClick={openModal}>+</button>
                        )}
                    </div>
                    {filteredNotes.length !== 0 ? (
                        <div>
                            <div className={"search-bar-container"}>
                                <input
                                    className={"search-bar"}
                                    type={"text"}
                                    placeholder={"노트의 제목을 입력해주세요."}
                                />
                            </div>
                            <div className={"sort-button-container"}>
                                <button onClick={openSortModal}>정렬</button>
                            </div>

                            <div className="note-list-container">
                                {pinnedNotes.length !== 0 && selectedTag.id !== trashTag.id && (
                                    <div>
                                        <div className={"note-list-container-title"}>
                                            <h3>Pinned Notes</h3>
                                            <p>({pinnedNotes.length})</p>
                                        </div>
                                        <div className={"pin-note-items"}>
                                            {pinnedNotes.map((note) => element(note, true))}
                                        </div>
                                    </div>
                                )}
                                <div className={"note-list-container-title"}>
                                    <h3>All Notes</h3>
                                    <p>({unpinnedNotes.length})</p>
                                </div>
                                <div className={"unpin-note-items"}>
                                    {unpinnedNotes.map((note) => element(note, false))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={"no-note-container"}>
                            <h3 className={"no-note"}>노트가 없습니다.</h3>
                        </div>
                    )}

                    {isModalOpen && <CreateNoteModal onClose={closeModal} selectedTag={selectedTag}/>}
                    {isSortModalOpen && <SortNotesModal onClose={closeSortModal} onSort={handleSort} sortOption={sortOption}/>}
                </div>
            ) : (
                <MemoAppIntro></MemoAppIntro>
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