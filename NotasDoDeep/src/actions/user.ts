import {UserAuth} from '../state/features/user/user-slice';
import api from '../assets/api';
import {AxiosError} from 'axios';

export async function registration(auth: UserAuth) {
  try {
    const response = await api.post('/registration', auth, {
      headers: {Accept: 'application/json'},
    });
  } catch (error: AxiosError) {
    if (error.response.status === 409) {
      return {
        msg: 'Já existe usuário cadastrado com o email informado!',
        status: 409,
      };
    }
  }
  return {msg: 'Novo usuário cadastrado com sucesso!', status: 201};
}

export async function login(auth: UserAuth) {
  try {
    const response = await api.post('/login', auth, {
      headers: {Accept: 'application/json'},
    });
    return {
      msg: 'Usuário encontrado com sucesso!',
      status: 200,
      data: response.data,
    };
  } catch (error: AxiosError) {
    if (error.response.status === 403) {
      return {
        msg: 'Email ou senha invalidos!',
        status: 403,
      };
    }
  }
}
