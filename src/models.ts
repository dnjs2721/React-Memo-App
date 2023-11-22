export interface Tag {
    id: number;
    name: string;
    pinNotes: any;
    img: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    priority: string;
    color: string;
    editTime: number;
}

export interface NoteTag {
    noteId: number;
    tagId: number;
}