import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Note {
  id?: number;
  type: string;
  title: string;
  user_id: number;
  description: string;
}

interface NotesState {
  notes: Note[];
}

const initialState: NotesState = {
  notes: [],
};

export const notesSlice = createSlice({
  name: 'notesState',
  initialState,
  reducers: {
    getNoteList: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    createNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.indexOf(action.payload);
      state.notes.splice(index, 1);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      let note_index: number = -1;
      state.notes.forEach((element, index) => {
        if (element.id === action.payload.id) {
          note_index = index;
        }
      });
      state.notes[note_index] = action.payload;
    },
  },
});

export const {createNote, deleteNote, updateNote, getNoteList} =
  notesSlice.actions;

export const NoteReducer = notesSlice.reducer;
