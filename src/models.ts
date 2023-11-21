export interface Tag {
    id: number;
    name: string;
    pinNotes: any;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    priority: string;
    color: string;
}

export interface NoteTag {
    noteId: number;
    tagId: number;
}