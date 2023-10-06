import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserAuth {
  name?: string;
  email: string;
  password: string;
}

export interface UserState {
  token: string;
  currentUser: User;
}

const initialState: UserState = {
  token: '',
  currentUser: {
    email: '',
    id: 0,
    name: '',
  },
};

export const userSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    signin: (state, action: PayloadAction<UserState>) => {
      state.token = action.payload.token;
      state.currentUser = action.payload.currentUser;
    },
    logout: state => {
      state.token = '';
      state.currentUser = {
        email: '',
        id: 0,
        name: '',
      };
    },
  },
});

export const {signin, logout} = userSlice.actions;

export const UserReducer = userSlice.reducer;
