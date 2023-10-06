import {configureStore} from '@reduxjs/toolkit';
import {UserReducer} from '../features/user/user-slice';
import {NoteReducer} from '../features/notes/notes-slice';

export const store = configureStore({
  reducer: {
    user: UserReducer,
    notes: NoteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
