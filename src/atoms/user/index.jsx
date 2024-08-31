import { atom } from 'recoil';

export const keys = {
  TOKEN_USER: 'ATOM/USER/TOKEN_USER',
  IMAGE_USER: 'ATOM/USER/IMAGE_USER',
  LIST_UPDATE: 'ATOM/USER/LIST_UPDATE',
};

export const tokenUser = atom({
  key: keys.TOKEN_USER,
  default: '',
});

export const updateImageUser = atom({
  key: keys.IMAGE_USER,
  default: false,
});

export const listUpdate = atom({
  key: keys.LIST_UPDATE,
  default: false,
});
