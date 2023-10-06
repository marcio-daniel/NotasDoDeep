import {AxiosError} from 'axios';
import api from '../assets/api';
import {Note} from '../state/features/notes/notes-slice';

export async function getNotes(user_id: number, token: string) {
  try {
    const id = user_id;
    const complete_Token = `Bearer ${token}`;
    const {data} = await api.get(`/note?user_id=${id}`, {
      headers: {
        Authorization: complete_Token,
        Accept: 'application/json',
      },
    });
    const note_list: Note[] = data;
    return note_list;
  } catch (error: AxiosError) {
    console.log(error.response);
  }
}

export async function createNote(note: Note, token: string) {
  try {
    const complete_Token = `Bearer ${token}`;
    const {data} = await api.post('/note', note, {
      headers: {
        Authorization: complete_Token,
        Accept: 'application/json',
      },
    });
    return data;
  } catch (error: AxiosError) {
    console.log(error.response);
  }
}

export async function updateNote(note: Note, token: string) {
  try {
    const complete_Token = `Bearer ${token}`;
    const {data} = await api.put(`/note/${note.id}`, note, {
      headers: {
        Authorization: complete_Token,
        Accept: 'application/json',
      },
    });
    return data;
  } catch (error: AxiosError) {
    console.log(error.response);
  }
}
